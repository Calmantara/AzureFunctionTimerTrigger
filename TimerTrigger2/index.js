const { EventHubConsumerClient, latestEventPosition } = require('@azure/event-hubs');
const { Client } = require('pg');
const { QueryScript } = require('./query')
const configJson = require('./config.json')

const client = new Client(configJson.database);

client.connect((err) => {
    if (err) {
        console.error('connection error', err.stack);
    } else {
        console.log('connected');
        console.log(`First Connected:${new Date()}`);
    }
});
const queryScript = new QueryScript();

async function main() {
    // Create a consumer client for the event hub by specifying the checkpoint store.
    const consumerClient = new EventHubConsumerClient(
        configJson.eventhub.consumerGroup,
        configJson.eventhub.connectionString,
        configJson.eventhub.eventHubName
    );
    const subscriptionOptions = {
        startPosition: latestEventPosition,
        maxBatchSize: 2,
        maxWaitTimeInSeconds: 5 * 60
    };
    const partitionIds = await consumerClient.getPartitionIds();
    // Subscribe to the events, and specify handlers for processing the events and errors.
    const subscription = consumerClient.subscribe(partitionIds[configJson.partitionId], {
        processEvents: async (event, context) => {
            try {
                console.info(event);
                event.map((val, index) => {
                    val.body.map(bodyVal => {
                        let newDate = new Date(bodyVal.timestamp);
                        let values = bodyVal.values;
                        let timestamp = queryScript.ChangeDatetimeFormattoString({ date: newDate })
                        client.query(queryScript.InsertDatatoDatabase({ values: values, timestamp: timestamp }), (err, res) => {
                            if (!err) {
                                // console.log(`success inserting at ${new Date()}`);
                            } else {
                                console.log(`error when inserting ${err.stack}`);
                            }
                        });
                    })
                })
            } catch (err) {
                console.warn(`error occur ${err.stack}`)
            }
        },

        processError: async (err, context) => {
            console.log(`Error : ${err}`);
        },
    }, subscriptionOptions);
    await new Promise((resolve) => {
        setTimeout(async () => {
            await subscription.close();
            await consumerClient.close();
            await client.end();
            console.info(`Last Connected:${new Date()}`);
            resolve();
            process.exit(1);
        }, (3598_000 / 1) * 10);
    });
}

main().catch((err) => {
    console.log('Error occurred: ', err);
});

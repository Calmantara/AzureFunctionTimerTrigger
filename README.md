# Azure Function App Subscribe Event Hub

This is code to subscribe message from Event Hub and dtore the messages into PostgreSQL database

Backend components are : 
* NodeJs

## Configuration
Setup the **config.json** files before deploy the apps
```Bash
{
	"database": {
		"host": "postgres_host",
		"port": "ostgres_port",
		"user": "postgres_username",
		"password": "postgres_password",
		"database": "",
		"ssl": true
	},
	"eventhub": {
		"connectionString": "connection string",
		"eventHubName": "eventHubName",
		"consumerGroup": "consumergroup"
	},
	"partitionId": 0
}
```

## Authors

* **Calmantara Sumpono Putra**  - [Github](https://github.com/Calmantara)

## Acknowledgments

* Allah SWT
* My Mommy
* All sides that support and inpire me

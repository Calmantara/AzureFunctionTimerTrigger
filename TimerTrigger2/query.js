class QueryScript {
    InsertDatatoDatabase({ values, timestamp }) {
        return `INSERT INTO [tablename] (message, created_at, source) ` +
            `VALUES ( ` +
            `'{"values":${JSON.stringify(values)}}', ` +
            `'${timestamp}', '[Source]' ` +
            `);`;
    }

    ChangeDatetimeFormattoString({ date }) {
        return date.getFullYear() +
            '-' +
            (1 + date.getMonth()) +
            '-' +
            date.getDate() +
            ' ' +
            date.getHours() +
            ':' +
            date.getMinutes() +
            ':' +
            date.getSeconds();
    }
}

module.exports = { QueryScript: QueryScript }
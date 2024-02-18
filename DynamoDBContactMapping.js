const {
    attribute,
    autoGeneratedHashKey,
    table
  } = require('@aws/dynamodb-data-mapper-annotations');

const tableName = process.env.DYNAMODB_TABLE_NAME;
if (!tableName) {
  throw new Error('Environment variable DYNAMODB_TABLE_NAME is not set.');
}
console.log(tableName)

@table(tableName)
class Contact {
    @autoGeneratedHashKey()
    id;
  
    @attribute()
    name;
  
    @attribute()
    number;
}
  
module.exports = Contact;
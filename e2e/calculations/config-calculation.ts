// inhabitant must be in database before start calculations e2e testing
// in inhabitant table field user must be user's id with username user
// fields streetName and buildingNumber in building table and connect to inhabitant by id
// calculationType must be in calculationtype table
// if error occured make sure data here are the same as in database
exports.inhabitant = {
    surname: 'Романюк',
    name: 'Дмитро',
    patronymic: 'Петрович',
    appartment: '2',
    streetName: 'Головна',
    buildingNumber: '2',
    calculationType: 'Газ',
    typeAddedWithinTest: 'Е2Е',
    toPay: '50',
    payed: '1'
}
const mongoose = require('mongoose');
const { mongodbUri } = require('../../util');

beforeAll(async () => {
  await mongoose.connect(mongodbUri, { useNewUrlParser: true });
});

const Class = require('../../models/class');

describe('Sample Test', () => {
  it('should test that true === true', async () => {
    console.log('got here');
    await Class.findOne({ index: 'wizard' }).then(data => {
      console.log(data);
    });
    expect(true).toBe(true);
  });
});

afterAll(() => {
  mongoose.disconnect();
});

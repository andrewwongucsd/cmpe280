describe('Air California OK', function() {
  // Before script for each test
  before(function() {
    casper.start('http://localhost:8080/');
  });

  // *** Test 1 ***
  // Is the Google search page accessible?
  it('should have return HTTP 200', function() {
    expect(casper.currentHTTPStatus).to.equal(200);
  });

  // *** Test 2 ***
  // // Is the search function able to return a list of result?
  // it('should be able to search', function() {
  //   // Wait for the search form
  //   casper.waitForSelector('form[action="/search"]', function() {
  //     'form[action="/search"]'.should.be.inDOM;
  //   });
  //
  //   // Fill in the form and submit
  //   casper.then(function() {
  //     this.fill('form[action="/search"]', { q: 'Boatswain' }, true);
  //   });
  //
  //   // Check if the result set contains text "Boatswain"
  //   casper.waitForSelector('h3.r a', function() {
  //     'h3.r a'.should.be.inDOM;
  //     expect('h3.r a').to.contain.text(/Boatswain/);
  //   });
  // });
});

var webdriver = require('selenium-webdriver'), By = webdriver.By, until = webdriver.until;
var driver = new webdriver.Builder().forBrowser('chrome').build();

driver.get('http://127.0.0.1:8080/');

driver.findElement(By.id('depart_airport')).sendKeys('SFO');
driver.findElement(By.id('arrival_airport')).sendKeys('SAN');
driver.findElement(By.id('depart_date')).sendKeys('2018-04-16');

driver.findElement(By.id('flight_search_form_button')).click();
driver.wait(function(){
  var promise = driver.getTitle().then(function(){
    if(title == 'wiki - Google Search'){
      console.log('success');
      return true;
    }else{
      console.log('fail -- '+title);
    }
  });
  return promise;
}, 1000);

// var webdriver = require('selenium-webdriver');
// var driver = new webdriver.Builder().build();
// driver.sleep(3000);
// driver.quit();

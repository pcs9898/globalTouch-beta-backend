const fs = require('fs');

// JSON 파일을 읽습니다.
fs.readFile('./seeds-data/project.seed.json', 'utf8', function (err, data) {
  if (err) throw err;

  // JSON을 JavaScript 객체로 변환합니다.
  let obj = JSON.parse(data);

  // 각 객체의 "city_name" 키의 값을 "cityName" 키에 할당하고, "city_name" 키를 삭제합니다.
  obj.forEach((item) => {
    item.cityName = item.city_name;
    delete item.city_name;
  });

  // JavaScript 객체를 JSON으로 변환하여 파일에 저장합니다.
  fs.writeFile(
    'project.seed.json',
    JSON.stringify(obj, null, 2),
    'utf8',
    function (err) {
      if (err) throw err;
      console.log('The file has been saved with the new key!');
    },
  );
});

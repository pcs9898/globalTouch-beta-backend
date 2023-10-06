// 국가 코드만 출력
const fs = require('fs');
const XLSX = require('xlsx');

// 엑셀 파일 읽기
const workbook = XLSX.readFile(
  './국가정보(국가코드,한글국가이름,영어국가이름,위도,경도).xlsx',
);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

// 엑셀 데이터를 JSON 배열로 변환
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// 국가 코드 열 데이터 추출
const countryCodeColumn = jsonData.map((row) => row[0]);

// JSON 형식으로 변환
const result = countryCodeColumn.map((countryCode) => countryCode);

// JSON 파일로 저장
fs.writeFileSync('countryCode.seed.json', JSON.stringify(result, null, 2));

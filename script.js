// 1. треугольник
function triangle(a, b, c) {

  if (a + b > c && a + c > b && b + c > a) {

    const perimeter = a + b + c;
    const p = perimeter / 2;
    const area = Math.sqrt(p * (p - a) * (p - b) * (p - c));
    const ratio = perimeter / area;

    console.log("№1.\nтреугольник существует");
    console.log("периметр =", perimeter);
    console.log("площадь =", area);
    console.log("соотношение =", ratio);

  } else {
    console.log("№1.\nтреугольника не существует");
  }
}

triangle(3, 4, 5);


// 2. физ баз
function fizzBuzz(max) {

  for (let i = 0; i <= max; i++) {

    if (i % 5 === 0 && i !== 0) {
      console.log("№2.\n", i, "fizz buzz");
    }
    else if (i % 2 === 0) {
      console.log("№2.\n", i, "buzz");
    }
    else {
      console.log("№2.\n", i, "fizz");
    }

  }
}

fizzBuzz(6);


// 3. ёлка
function tree(height) {

  let result = "";

  for (let i = 1; i <= height; i++) {

    const symbol = (i % 2 === 0) ? "#" : "*";

    for (let j = 0; j < i; j++) {
      result = result + symbol;
    }

    result = result + "\n";
  }

  result = result + "||";

  console.log("№3.\n" + result);
}

tree(6);


// 4. деление
function divide(n, x, y) {

  if (n % x === 0 && n % y === 0) {
    return true;
  } else {
    return false;
  }

}

const n = 12;
const x = 2;
const y = 6;

console.log("№4.\n n =", n, "x =", x, "y =", y, "=>", divide(n, x, y));


// 5. сэндвичи
function countSandwiches(obj) {

  const bread = obj.bread;
  const cheese = obj.cheese;

  const byBread = Math.floor(bread / 2);

  if (byBread < cheese) {
    return byBread;
  } else {
    return cheese;
  }

}

console.log("№5.\n", countSandwiches({ bread: 5, cheese: 6 }));


// 6. модуль
function absValue(x) {

  if (x < 0) {
    return -x;
  } else {
    return x;
  }

}

console.log("№6\n", absValue(-2));


// 7. температура
function convertTemperature(value, direction) {

  if (direction === "toC") {
    const c = (value - 32) * 5 / 9;
    return c + " C";
  }

  if (direction === "toF") {
    const f = value * 9 / 5 + 32;
    return f + " F";
  }

}

console.log("№7.\n", convertTemperature(32, "toC"), "\n", convertTemperature(10, "toF"));


// 8. случайное число
function randomNumber(min, max) {

  return Math.floor(Math.random() * (max - min + 1)) + min;

}

console.log("№8.\n", randomNumber(0, 10));


// 9. случайные элементы
function sampleArray(arr, count) {

  const result = [];

  for (let i = 0; i < count; i++) {

    const index = randomNumber(0, arr.length - 1);
    result.push(arr[index]);

  }

  return result;
}

console.log("№9.\n", sampleArray([1, 2, 3, 4], 2));


// 10. свой фильтер
function myFilterArray(arr, func) {

  const result = [];

  for (let i = 0; i < arr.length; i++) {

    if (func(arr[i])) {
      result.push(arr[i]);
    }

  }

  return result;
}

function isFirstV(name) {
  return name.startsWith("V");
}

console.log("№10.\n", myFilterArray(["Short", "VeryLong"], isFirstV));


// 11. плавающая запятая
function toBeCloseTo(num1, num2) {

  if (Math.abs(num1 - num2) < Number.EPSILON) {
    return true;
  } else {
    return false;
  }

}

console.log("№11.\n", toBeCloseTo(0.1 + 0.2, 0.3));
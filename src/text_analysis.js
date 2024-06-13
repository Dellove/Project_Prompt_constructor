const { PythonShell } = require('python-shell');

// Тестовый текст для анализа
const testText = "This is a test text to analyze the quality and sentiment.";

let options = {
  mode: 'text',
  pythonPath: 'python',
  pythonOptions: ['-u'], // get print results in real-time
  scriptPath: './',
  args: [testText]  // Передаем текст как аргумент командной строки
};

let pyshell = new PythonShell('analysais.py', options);

pyshell.on('message', function (message) {
  // Получаем результаты анализа из Python-скрипта
  console.log(message);
});

// Завершаем ввод и позволяем процессу завершиться
pyshell.end(function (err, code, signal) {
  if (err) throw err;
  console.log('The exit code was: ' + code);
  console.log('The exit signal was: ' + signal);
  console.log('finished');
});
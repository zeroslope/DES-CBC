// const prompts = require('prompts');
const fs = require('fs')
const path = require('path')
const ora = require('ora')
const inquirer = require('inquirer')

const DES_CBC = require('./des.js')

console.log(
`DES(CBC)文件加密
密匙：　　　　　　　　长度为16的16进制串
工作模式：　　　　　　加密 / 解密
加解密文件地址：　　　绝对地址 / 相对地址 (请确保文件存在)
输出文件地址：　　　　只需输入用户名，仅支持保存在当前目录(防止错误覆盖其他目录文件)
`)

inquirer
  .prompt([
    {
      type: 'input',
      name: 'keys',
      message: `请输入您的密匙(16位HEX):`,
      default: `1234567890ABCDEF`,
      transformer: (val) => {
        return '0x' + val
      },
      validate: (val) => {
        let regex = RegExp('[0-9a-fA-F]{16}')
        return regex.test(val) ? true : '您的输入错误，请重新输入'
      }
    },
    {
      type: 'list',
      name: 'mode',
      message: '请选择工作模式',
      choices:[
        {
          name: '加密',
          value: 'encrypt'
        },
        {
          name: '解密',
          value: 'decrypt'
        }
      ]
    },
    {
      type: 'input',
      name: 'fileName',
      message: (answers) => {
        return `选择您要${answers.mode === 'encrypt' ? '加密' : '解密' }的文件:`
      },
      validate: function (val) {
        let done = this.async()
        let fsPath = path.isAbsolute(val) ? val : path.join(process.cwd(), val)
        fs.stat(fsPath, (err, stats) => {
          if (err) {
            done('文件地址错误')
          } else {
            if (stats.isFile()) {
              done(null, true)
            } else {
              done('请输入文件地址，请勿输入目录地址')
            }
          }
        })
      }
    },
    {
      type: 'input',
      name: 'outputName',
      message: '输出文件的名称(*.txt):',
      validate: function (val) {
        let preg = /^[^\/:*?""<>|]+.txt/
        return preg.test(val) ? true : '文件名称不符合要求'
      }
    }
  ])
  .then(answers => {
    let spinner = ora('Loading File').start()
    let fsPath = path.isAbsolute(answers.fileName) ? answers.fileName : path.join(process.cwd(), answers.fileName)
    let buf
    try {
      buf = fs.readFileSync(fsPath)
    } catch (error) {
      spinner.fail()
      throw error
    }
    spinner = spinner.succeed()

    spinner.start(`Start ${answers.mode}`)
    let des = new DES_CBC(answers.mode, answers.keys, buf.toString('hex'))
    let out = answers.mode === 'decrypt' ? des.decrypt() : des.encrypt()
    spinner = spinner.succeed()

    spinner.start(`Writing ${answers.mode}`)
    let outPath = path.join(process.cwd(), answers.outputName)
    try {
      fs.writeFileSync(outPath, Buffer.from(out, 'hex'))
    } catch (error) {
      spinner.fail()
      throw error
    }
    spinner.succeed()
  });
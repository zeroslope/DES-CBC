
let _ = require('lodash');

let PC1 = [
    56, 48, 40, 32, 24, 16, 8,
    0, 57, 49, 41, 33, 25, 17,
    9, 1, 58, 50, 42, 34, 26,
    18, 10, 2, 59, 51, 43, 35,
    62, 54, 46, 38, 30, 22, 14,
    6, 61, 53, 45, 37, 29, 21,
    13, 5, 60, 52, 44, 36, 28,
    20, 12, 4, 27, 19, 11, 3
];

let PC2 = [
    13, 16, 10, 23, 0, 4,
    2, 27, 14, 5, 20, 9,
    22, 18, 11, 3, 25, 7,
    15, 6, 26, 19, 12, 1,
    40, 51, 30, 36, 46, 54,
    29, 39, 50, 44, 32, 47,
    43, 48, 38, 55, 33, 52,
    45, 41, 49, 35, 28, 31
];

// Cumulative bit shift constants
let LEFT_ROTATE = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1]

let IP = [
    57, 49, 41, 33, 25, 17, 9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7,
    56, 48, 40, 32, 24, 16, 8, 0,
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6
]

let EXPANSION_TABLE = [
    31, 0, 1, 2, 3, 4,
    3, 4, 5, 6, 7, 8,
    7, 8, 9, 10, 11, 12,
    11, 12, 13, 14, 15, 16,
    15, 16, 17, 18, 19, 20,
    19, 20, 21, 22, 23, 24,
    23, 24, 25, 26, 27, 28,
    27, 28, 29, 30, 31, 0
]

let SBOX = [
    [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7,
        0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8,
        4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0,
        15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13],

    [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10,
        3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5,
        0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15,
        13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9],

    [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8,
        13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1,
        13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7,
        1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12],

    [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15,
        13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9,
        10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4,
        3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14],

    [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9,
        14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6,
        4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14,
        11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3],

    [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11,
        10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8,
        9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6,
        4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13],

    [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1,
        13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6,
        1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2,
        6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12],

    [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7,
        1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2,
        7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8,
        2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11],
]

let PBOX = [
    15, 6, 19, 20, 28, 11, 27, 16,
    0, 14, 22, 25, 4, 17, 30, 9,
    1, 7, 23, 13, 31, 26, 2, 8,
    18, 12, 29, 5, 21, 10, 3, 24
]

let FP = [
    39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28,
    35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26,
    33, 1, 41, 9, 49, 17, 57, 25,
    32, 0, 40, 8, 48, 16, 56, 24
]

function strToBitList(data) {
    if (typeof data !== 'string') {
        throw 'The input strToBitList function should be string.'
    }
    let asciiData = data.split('').map(ch => {
        return ch.charCodeAt()
    })
    let len = asciiData.length * 8
    let pos = 0
    let res = []
    asciiData.forEach(ch => {
        for (let i = 7; i >= 0; --i) {
            if ((ch & (1 << i)) === 0) {
                res.push(0)
            } else {
                res.push(1)
            }
        }
    })
    return res
}

function hexStrToBitList(data) {
    if (typeof data !== 'string') {
        throw 'The input hexStrToBitList function should be string.'
    }
    let len = data.length
    let res = []
    for (let i = 0; i < (len >> 3); ++i) {
        let num = parseInt(data.slice(i * 8, i * 8 + 8), 16)
        res = res.concat(num2Arr(num, 32))
    }
    return res
}

function bitListToString(data) {
    if (typeof data !== 'string') {
        throw 'The input bitListToString function should be string.'
    }
    let res = []
    let c = 0, pos = 0
    while (pos < data.length) {
        c += data[pos] << (7 - (pos % 8))
        if ((pos % 8) === 7) {
            res.push(c)
            c = 0
        }
        pos += 1
    }
    res = res.map(ch => {
        return String.fromCharCode(ch)
    })
    return res.join('')
}

// function hexStr2Str(hexStr) {
//     let len = hexStr.length
//     let str = ''
//     if (len % 2 !== 0) {
//         throw 'hex2str\'s args should be even'
//     }
//     for (let i = 0; i < (len >> 1); ++i) {
//         let ch = parseInt(hexStr.slice(i * 2, i * 2 + 2), 16)
//         str += String.fromCharCode(ch)
//     }
//     return str
// }

function binArr2Hex(arr) {
    let len = arr.length
    if (len % 4 !== 0) {
        throw 'binArr2Hex\'s args length should be 4*n'
    }
    let res = []
    for (let i = 0; i < (len >> 2); ++i) {
        let num = arr2Num(arr.slice(i * 4, i * 4 + 4))
        res.push(num.toString(16))
    }
    return res
}

function arr2Num(arr) {
    return arr.reduce((sum, val) => sum * 2 + val, 0)
}

function num2Arr(num, round) {
    if (num < 0) {
        throw 'function num2arr args should larger than 0.'
    }
    let arr = []
    for (let i = 0; i < round; ++i) {
        arr.unshift((num >> i) & 1)
    }
    return arr
}

function xorArray(bitsL, bitsR) {
    return bitsL.map((bit, index) => {
        return bit ^ bitsR[index]
    })
}

// function binArrToHex(arr) {
//     let len = arr.length
//     if (len % 4 !== 0) {
//         throw 'binArrToHex\'s args length should be 4*n'
//     }
//     let res = []
//     for (let i = 0; i < (len >> 2); ++i) {
//         let num = arr2Num(arr.slice(i * 4, i * 4 + 4))
//         res.push(num.toString(16))
//     }
//     return res
// }

class DES_CBC {
    constructor(mode, key, data, pad = '0', iterRound = 8) {
        this.key = key
        this.pad = pad
        this.data = data
        this.mode = mode
        this.iterRound = iterRound
        this.keys = this.initKey()
    }

    paddindData() {
        let len = this.data.length
        let paddingLen = 16 - ( (len % 16) === 0 ? 16 : (len % 16) )
        // console.log('\n',len,paddingLen)
        this.data += _.repeat(this.pad, paddingLen)
        this.data += ( _.repeat(this.pad, 15) + paddingLen.toString(16) )
        // console.log(this.data.length)
        // console.log(this.data)
    }

    // 生成16轮所需要的密码
    initKey() {
        let bits = this.permutate(PC1, hexStrToBitList(this.key))

        let bitsL = bits.slice(0, 28)
        let bitsR = bits.slice(28, 56)

        let keys = []

        for (let i = 0; i < this.iterRound; i++) {
            for (let j = 0; j < LEFT_ROTATE[i]; j++) {
                bitsL.push(bitsL.shift())
                bitsR.push(bitsR.shift())
            }
            keys.push(this.permutate(PC2, bitsL.concat(bitsR)))
        }
        if (this.mode === 'decrypt') {
           keys.reverse()
        }
        return keys
    }

    eBox(round, bitsR) {
        bitsR = this.permutate(EXPANSION_TABLE, bitsR)
        bitsR = xorArray(bitsR, this.keys[round])
        let sliceArr = [...Array(8).keys()].map(val => {
            return bitsR.slice(val * 6, val * 6 + 6)
        })
        return sliceArr
    }

    sBox(sliceArr) {
        let block = []
        for (let i = 0;i < 8;++ i) {
            let m = ((sliceArr[i][0] << 1) + sliceArr[i][5])
            let n = arr2Num(sliceArr[i].slice(1, 5))
            let val = SBOX[i][(m << 4) + n]
            block = block.concat(num2Arr(val, 4))
        }
        let bitsR = this.permutate(PBOX, block)
        return bitsR
    }

    cryptBlock(block) {
        block = this.permutate(IP, block)

        let bitsL = block.slice(0, 32)
        let bitsR = block.slice(32, 64)

        for (let i = 0; i < this.iterRound; i++) {
            let copyR = bitsR.slice()
            let sliceArr = this.eBox(i, bitsR)
            bitsR = this.sBox(sliceArr)
            bitsR = xorArray(bitsR, bitsL)
            bitsL = copyR
        }

        return this.permutate(FP, bitsR.concat(bitsL))
    }

    encrypt() {
        this.paddindData()
        let len = this.data.length
        let out = []
        for (let i = 0; i < (len >> 4); ++i) {
            let block = hexStrToBitList(this.data.slice(i * 16, i * 16 + 16))
            out = out.concat(this.cryptBlock(block))
        }
        return binArr2Hex(out).join('')
    }

    decrypt() {
        let len = this.data.length
        if (len % 16 !== 0) {
            throw 'Illegal decrypt data.'
        }
        let out = []
        for (let i = 0; i < (len >> 4); ++i) {
            let block = hexStrToBitList(this.data.slice(i * 16, i * 16 + 16))
            out = out.concat(this.cryptBlock(block))
        }
        let paddingLen = arr2Num(out.slice(out.length-64, out.length))
        // console.log(paddingLen)
        let hexStr = binArr2Hex(out).join('')
        return hexStr.slice(0, hexStr.length-(16+paddingLen))
    }

    permutate(table, block) {
        return table.map(p => {
            return block[p]
        })
    }
}

module.exports = DES_CBC

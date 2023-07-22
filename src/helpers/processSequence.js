/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import * as R from 'ramda'

const api = new Api();

const URLS = {
    NUMBERS: 'https://api.tech/numbers/base',
    ANIMALS: 'https://animals.tech/'
}

const isLessThan10 = R.lt(R.__, 10)
const isGreaterThan2 = R.gt(R.__, 2)
const isValidStr = R.test(/^[0-9]+(\.[0-9]+)?$/)

const isValidLength = R.pipe(R.length, R.both(isLessThan10, isGreaterThan2))
const validation = R.allPass([isValidLength, isValidStr])

const toNumber = value => +value
const round = value => Math.round(value).toFixed(0)
const toSquare = value => value ** 2
const getRemainder = value => value % 3

const convertToBinary = (id) => api.get(URLS.NUMBERS, {from: 10, to: 2, number: id })
const getAnimal = (id) => api.get(URLS.ANIMALS+id, {})
const getResult = R.prop('result')

const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    const tapWriteLog = R.tap(writeLog)

    const runChain = R.pipe(
        toNumber,
        round,
        tapWriteLog,
        convertToBinary,
        R.andThen(getResult),
        R.andThen(tapWriteLog),
        R.andThen(R.length),
        R.andThen(tapWriteLog),
        R.andThen(toSquare),
        R.andThen(tapWriteLog),
        R.andThen(getRemainder),
        R.andThen(tapWriteLog),
        R.andThen(getAnimal),
        R.andThen(getResult),
        R.andThen(handleSuccess),
        R.otherwise(handleError)
    )

    const onInvalidInput = R.partial(handleError, ['ValidationError'])
    const runValidation = R.ifElse(validation, runChain, onInvalidInput)

    const runCode = R.pipe(tapWriteLog, runValidation)

    runCode(value)
}

export default processSequence;

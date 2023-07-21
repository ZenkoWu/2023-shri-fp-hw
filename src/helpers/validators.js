import * as R from 'ramda'
import { COLORS, SHAPES } from '../constants';
/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

// const isStarOrange = R.propEq(SHAPES.STAR, COLORS.ORANGE)
// const isCircleOrange = R.propEq(SHAPES.CIRCLE, COLORS.ORANGE)
// const isSquareOrange = R.propEq(SHAPES.SQUARE, COLORS.ORANGE)
// const isTriangleOrange = R.propEq(SHAPES.TRIANGLE, COLORS.ORANGE)

const getStarColor = R.prop(SHAPES.STAR)
const getSquareColor = R.prop(SHAPES.SQUARE)
const getCircleColor = R.prop(SHAPES.CIRCLE)
const getTriangleColor = R.prop(SHAPES.TRIANGLE)

const isOrange = R.equals(COLORS.ORANGE)
const isRed = R.equals(COLORS.RED)
const isBlue = R.equals(COLORS.BLUE)
const isGreen = R.equals(COLORS.GREEN)
const isWhite = R.equals(COLORS.WHITE)

const isStarOrange = R.compose(isOrange, getStarColor)
const isCircleOrange = R.compose(isOrange, getCircleColor)
const isSquareOrange = R.compose(isOrange, getSquareColor)
const isTriangleOrange = R.compose(isOrange, getTriangleColor)

const isStarRed = R.compose(isRed, getStarColor)

const isSquareGreen = R.compose(isGreen, getSquareColor)
const isTriangleGreen = R.compose(isGreen, getTriangleColor)
const isCircleGreen = R.compose(isGreen, getCircleColor)
const isStarGreen = R.compose(isGreen, getStarColor)

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = R.allPass([
    isSquareGreen,
    isStarRed,
    R.compose(isWhite, getCircleColor),
    R.compose(isWhite, getTriangleColor),
])

const gte = (n) => (length) => R.gte(length, n)
const colorFilter = (color) => (arr) => R.filter(el=> el === color, arr)

const getFilterColorsLength = (color) => R.compose(R.length, colorFilter(color), R.values)
// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = R.allPass([
    R.compose(gte(2), getFilterColorsLength(COLORS.GREEN)),
])

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = R.converge(R.equals, [getFilterColorsLength(COLORS.BLUE), getFilterColorsLength(COLORS.RED)])

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = R.allPass([
    R.compose(isOrange, getSquareColor),
    isStarRed,
    R.compose(isBlue, getCircleColor),
])

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = R.anyPass([
    R.compose(gte(3), getFilterColorsLength(COLORS.RED)),
    R.compose(gte(3), getFilterColorsLength(COLORS.GREEN)),
    R.compose(gte(3), getFilterColorsLength(COLORS.ORANGE)),
    R.compose(gte(3), getFilterColorsLength(COLORS.BLUE)),
])

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. 
// Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия

export const validateFieldN6 = R.allPass([
    isTriangleGreen,
    R.compose(R.equals(1), getFilterColorsLength(COLORS.RED)),
    R.compose(R.equals(2), getFilterColorsLength(COLORS.GREEN)),
])

// 7. Все фигуры оранжевые.
export const validateFieldN7 = R.allPass([
    isStarOrange, 
    isSquareOrange, 
    isCircleOrange, 
    isTriangleOrange
])

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = R.compose(R.not, isRed, getStarColor)

// 9. Все фигуры зеленые.
export const validateFieldN9 = R.allPass([
    isStarGreen,
    isCircleGreen,
    isSquareGreen,
    isTriangleGreen
])

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = R.allPass([
    R.compose(R.not, isWhite, getTriangleColor),
    R.compose(R.not, isWhite, getSquareColor),
    R.converge(R.equals, [getSquareColor, getTriangleColor])
])

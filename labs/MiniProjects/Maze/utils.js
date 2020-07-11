/**
 * Function to generate a 2D array and fill all cells with false
 * @param {int} row
 * @param {int} column
 */
const generateGrid = (row, column) => {
  return Array(row)
    .fill(null)
    .map(() => Array(column).fill(false))
}

/**
 * Function to sort every element in the given array randomly
 * @param {Array} arr
 */
const suffle = (arr) => {
  let counter = arr.length

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter)
    counter--

    // swap
    const temp = arr[counter]
    arr[counter] = arr[index]
    arr[index] = temp
  }

  return arr
}

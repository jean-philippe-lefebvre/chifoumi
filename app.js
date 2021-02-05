import { Timer } from './Timer.js'
const timerBoard = document.querySelector('.timer')
const modal = document.querySelector('.modaleWin')

const timer = new Timer({ 
		time: + timerBoard.innerText,
		minTime: 0,
})
timer.addAction( () => {
		timerBoard.innerText = ('' + timer.value).padStart(2, '0')
		// Change Type of Cursor Ennemy
		const random = Math.round(Math.random() * 2)
		changeCursor(cursorEnemy, random)
		// Arbitration
		if(timer.value === 0) countScore()
})

function countScore(){
	let winCursor = false	

	if(cursor.type === cursorEnemy.type) {
			modaleWin('Tie game!')
			return null
	}
		else if(cursor.type === 0 && cursorEnemy.type === 2) winCursor = true
		else if(cursor.type === 1 && cursorEnemy.type === 0) winCursor = true
		else if(cursor.type === 2 && cursorEnemy.type === 1) winCursor = true
	
	if(winCursor){ 
			cursor.score.innerHTML = +cursor.score.innerHTML + 1
			modaleWin('Won!')
	} else {
			cursorEnemy.score.innerHTML = +cursorEnemy.score.innerHTML + 1
			modaleWin('Losed!')
	}
}

function modaleWin(message){
	const modale = document.querySelector('.modaleWin')
	const note = document.querySelector('.modaleWin .note')
	note.innerHTML = message
	modale.style.display = 'block'
	modale.classList.add('appear')
	modale.classList.remove('disappear')
}

const cursor = {
	elem : document.querySelector('#myCursor'),
	elemR : document.querySelector('#rock2'),
	elemP : document.querySelector('#paper2'),
	elemS : document.querySelector('#scissors2'),
	type : 0,
	score: document.querySelector('.user1'),
}
const cursorEnemy = {
	elem : document.querySelector('#enemy'),
	elemR : document.querySelector('#rock'),
	elemP : document.querySelector('#paper'),
	elemS : document.querySelector('#scissors'),
	type : 2,
	score: document.querySelector('.user2'),
}

function changeCursor(cursor, indicator){
	const newType = cursor.type + indicator
	const reste = newType - 3 > 0 ? newType - 3 : 0

	cursor.type = newType >= 3 ? 0 + reste
		: ( newType < 0 ? 
			3 - 1
			: newType)

	cursor.elemR.style.display = 'none'
	cursor.elemP.style.display = 'none'
	cursor.elemS.style.display = 'none'

	if(cursor.type === 0) cursor.elemR.style.display = 'block'
	if(cursor.type === 1) cursor.elemP.style.display = 'block'
	if(cursor.type === 2) cursor.elemS.style.display = 'block'
}

const spaceGame = document.querySelector('.spaceGame')
let clientX = -100
let clientY = -100

const render = () => {
	cursor.elem.style.top = `${clientY - 25}px`
	cursor.elem.style.left = `${clientX - 25}px`
	
	requestAnimationFrame(render)
}
requestAnimationFrame(render)

//Follow the mouse
document.addEventListener('mousemove', (e) => {
	clientX = e.clientX
	clientY = e.clientY

	cursorInSpaceGame(cursor, spaceGame, ({
		positionRelatifX, 
		positionRelatifY, 
		positionXCursor, 
		positionYCursor, 
		cursor, 
		area
	}) => {
		// Action dans SpaceGame
		cursorDirection(positionRelatifX, cursor, area)
		timer.start()
	}, () => {
		// Action hors SpaceGame
		timer.reset()
		modal.classList.add('disappear')
		modal.classList.remove('appear')
	})
})

// Change cursor
document.addEventListener('click', event => {
	event.preventDefault()
	changeCursor(cursor, 1)
})
// Change cursor & desabled contextmenu
document.addEventListener('contextmenu', event => {
	event.preventDefault()
	changeCursor(cursor, -1)
})

//Button restart the game
const btnRestart = document.querySelector('.modaleWin .btn')
document.addEventListener('keydown', (e) => {
		if(e.code === 'Space' && modal.classList.contains('appear')){
			timer.reset()
			timer.value = 4
			timer.start()
			modal.classList.add('disappear')
			modal.classList.remove('appear')
		}
})

modal.addEventListener('transitionend', () => {
	if(modal.classList.contains('disappear')) modal.style.display = 'none'
})

// Desabled drag and drop on cursor
cursor.elem.ondragstart = () => false

/**
 * Detects if the cursor is in the game area and activates an action accordingly.
 *
 * @param {obj} cursor, The cursor to inspect
 * @param {elem} area, DOM element of the play area
 * @param {callback} callback(rotation), Action to be carried out takes 
 */
function cursorInSpaceGame(cursor, area, callback, callbackOut){
	const size = cursor.elem.style.height
	const positionXCursor = cursor.elem.style.left.split('px')[0]
	const positionYCursor = cursor.elem.style.top.split('px')[0]
	const positionRelatifX = (positionXCursor - (area.offsetLeft + area.clientWidth /2 )) + (size/2)
	const positionRelatifY = (positionYCursor - (area.offsetTop + area.clientHeight /2 )) + (size/2)

	if( !(positionRelatifY >= (area.clientHeight /2 * -1)
			&& positionRelatifY <= area.clientHeight /2) ) return callbackOut()
	if( !(positionRelatifX >= (area.clientWidth /2 * -1)
			&& positionRelatifX <=area.clientWidth /2) ) return callbackOut()

	callback({
		positionRelatifX: positionRelatifX, 
		positionRelatifY: positionRelatifY,
		positionXCursor: positionXCursor,
		positionYCursor: positionYCursor,
		cursor: cursor, 
		area: area,
	})
}

/**
 * Detects whether you are on the left or the right side of the play area.
 *
 * @param {number} positionRelatifX, Mouse position in relation to the center of the game area
 * @param {obj} cursor, object indicating the cursor element DOM 
 * @param {elem} area, gaming zone 
 */
function cursorDirection(positionRelatifX, cursor, area) {
	const size = cursor.elem.height

	if(positionRelatifX !== 0){
		const rotation = positionRelatifX > 0 ? 'left' : 'right'
		const isRotated = cursor.elem.classList.contains(rotation)
		if(!isRotated){
			addClassLeftOrRight(rotation, cursor)
			addClassLeftOrRight(rotation === 'left' ? 'right' : 'left', cursorEnemy)
			changePositionOfScore(rotation)
		}
	}
}

/**
 * Changes the position of the scores
 */
function changePositionOfScore(rotation){
		const score = +cursor.score.innerHTML	
		const scoreEnemy = +cursorEnemy.score.innerHTML
	if(rotation === 'left') {
			cursor.score = document.querySelector('.user2')
			cursor.score.innerHTML = score
			cursorEnemy.score = document.querySelector('.user1')
			cursorEnemy.score.innerHTML = scoreEnemy
	} else {
			cursor.score = document.querySelector('.user1')
			cursor.score.innerHTML= score
			cursorEnemy.score = document.querySelector('.user2')
			cursorEnemy.score.innerHTML = scoreEnemy
	}
}

/**
 * Change class left | right in the cursor
 * @param {string} rotation ['left', 'right'], indication of the class to be added
 * @param {obj} cursor, indicates the DOM element of the cursor
 */
function addClassLeftOrRight(rotation, cursor){
	if(rotation === 'left') cursor.elem.classList.remove('right')
	if(rotation === 'right') cursor.elem.classList.remove('left')
	cursor.elem.classList.add(rotation)
}


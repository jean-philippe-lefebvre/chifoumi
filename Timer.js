export class Timer {
	constructor({ time, minTime }){
		this.value = time
		this.defaultValue = time
		this.activated = 0
		this.timer = null
		this.fun = null
		this.minTime = minTime
	}
	start(){
		if(!this.activated){
			this.activated = 1 
			this.loop()
		}
	}
	stop(){
		this.activated = 0
	}
	reset(){
		clearTimeout(this.timer)
		this.timer = 0
		this.value = this.defaultValue
		if(typeof this.fun === 'function' && this.activated === 1) this.fun()
		this.activated = 0
	}
	loop(){
		if( this.activated && !this._isValueEqualMinTime() ){
			this.value = this.value - 1
			if(typeof this.fun === 'function') this.fun()
			if(this._isValueEqualMinTime()) this.stop()
		}
			clearTimeout(this.timer)
			this.timer = setTimeout(this.loop.bind(this),1000)
	}
	addAction(fn){
			this.fun = fn
	}

	_isValueEqualMinTime(){
		return this.minTime !== undefined && this.minTime === this.value
	}
}

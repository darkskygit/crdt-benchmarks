import { AbstractCrdt, CrdtFactory } from '../../js-lib/index.js' // eslint-disable-line
import * as Y from '@y-octo/node'

export const name = 'yocto-node'

/**
 * @implements {CrdtFactory}
 */
export class YoctoFactory {
	/**
	 * @param {function(Uint8Array):void} [updateHandler]
	 */
	create(updateHandler) {
		return new YoctoCRDT(updateHandler)
	}

	getName() {
		return name
	}
}

/**
 * @implements {AbstractCrdt}
 */
export class YoctoCRDT {
	/**
	 * @param {function(Uint8Array):void} [updateHandler]
	 */
	constructor(updateHandler) {
		this.ydoc = new Y.Doc()
		if (updateHandler) {
			// this.ydoc.onUpdate((update) => {
			// 	updateHandler(update)
			// })
		}
		this.yarray = this.ydoc.getOrCreateArray('array')
		this.ymap = this.ydoc.getOrCreateMap('map')
		this.ytext = this.ydoc.getOrCreateText('text')
	}

	/**
	 * @return {Uint8Array|string}
	 */
	getEncodedState() {
		return Uint8Array.from(this.ydoc.encodeUpdateV1())
	}

	/**
	 * @param {Uint8Array} update
	 * @returns {Uint8Array}
	 */
	applyUpdate(update) {
		return this.ydoc.applyUpdate(Buffer.from(update))
	}

	/**
	 * @param {AbstractCrdt} doc
	 */
	syncDocument(doc) {
		let update = doc.getEncodedState()
		let diff = this.ydoc.applyUpdate(update)
		doc.applyUpdate(diff)

		update = this.getEncodedState()
		diff = doc.applyUpdate(update)
		this.applyUpdate(diff)
	}

	/**
	 * Insert several items into the internal shared array implementation.
	 *
	 * @param {number} index
	 * @param {Array<any>} elems
	 */
	insertArray(index, elems) {
		this.transact(() => this.yarray.insert(index, elems))
	}

	/**
	 * Delete several items into the internal shared array implementation.
	 *
	 * @param {number} index
	 * @param {number} len
	 */
	deleteArray(index, len) {
		this.transact(() => this.yarray.remove(index, len))
	}

	/**
	 * @return {Array<any>}
	 */
	getArray() {
		return this.yarray.toJson()
	}

	/**
	 * Insert text into the internal shared text implementation.
	 *
	 * @param {number} index
	 * @param {string} text
	 */
	insertText(index, text) {
		this.transact(() => this.ytext.insert(index, text))
	}

	/**
	 * Delete text from the internal shared text implementation.
	 *
	 * @param {number} index
	 * @param {number} len
	 */
	deleteText(index, len) {
		this.transact(() => this.ytext.remove(index, len))
	}

	/**
	 * @return {string}
	 */
	getText() {
		return this.ytext.toString()
	}

	/**
	 * @param {function (AbstractCrdt): void} f
	 */
	transact(f) {
		f(this)
	}

	/**
	 * @param {string} key
	 * @param {any} val
	 */
	setMap(key, val) {
		this.transact(() => this.ymap.set(key, val))
	}

	/**
	 * @return {Map<string,any> | Object<string, any>}
	 */
	getMap() {
		return this.ymap.toJson()
	}
}

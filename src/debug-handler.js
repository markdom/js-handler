/*
 * Copyright (c) 2017. Martin Brecht-Precht, Markenwerk GmbH
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

//noinspection JSUnusedGlobalSymbols
var DebugHandler = BindedJsClass.extend({
	_handleComments: true,
	_indentationLevel: 0,
	_output: [],
	onDocumentBegin: function () {
		this._output.push(this.getIndentation() + 'onDocumentBegin');
		this._indentationLevel++;
	},
	onDocumentEnd: function () {
		this._indentationLevel--;
		this._output.push(this.getIndentation() + 'onDocumentEnd');
	},
	onBlocksBegin: function () {
		this._output.push(this.getIndentation() + 'onBlocksBegin');
		this._indentationLevel++;
	},
	onBlockBegin: function (type) {
		this._output.push(this.getIndentation() + 'onBlockBegin: ' + type);
		this._indentationLevel++;
	},
	onCodeBlock: function (code, hint) {
		this._output.push(this.getIndentation() + 'onCodeBlock: ' + hint + ' ~ ' + code);
	},
	onCommentBlock: function (comment) {
		this._output.push(this.getIndentation() + 'onCommentBlock: ' + comment);
	},
	onDivisionBlock: function () {
		this._output.push(this.getIndentation() + 'onDivisionBlock');
	},
	onHeadingBlockBegin: function (level) {
		this._output.push(this.getIndentation() + 'onHeadingBlockBegin: ' + level);
	},
	onHeadingBlockEnd: function (level) {
		this._output.push(this.getIndentation() + 'onHeadingBlockEnd: ' + level);
	},
	onUnorderedListBlockBegin: function () {
		this._output.push(this.getIndentation() + 'onUnorderedListBlockBegin');
	},
	onOrderedListBlockBegin: function (startIndex) {
		this._output.push(this.getIndentation() + 'onOrderedListBlockBegin: ' + startIndex);
	},
	onListItemsBegin: function () {
		this._output.push(this.getIndentation() + 'onListItemsBegin');
	},
	onListItemBegin: function () {
		this._output.push(this.getIndentation() + 'onListItemBegin');
	},
	onListItemEnd: function () {
		this._output.push(this.getIndentation() + 'onListItemEnd');
	},
	onNextListItem: function () {
		this._output.push(this.getIndentation() + 'onNextListItem');
	},
	onListItemsEnd: function () {
		this._output.push(this.getIndentation() + 'onListItemsEnd');
	},
	onUnorderedListBlockEnd: function () {
		this._output.push(this.getIndentation() + 'onUnorderedListBlockEnd');
	},
	onOrderedListBlockEnd: function (startIndex) {
		this._output.push(this.getIndentation() + 'onOrderedListBlockEnd: ' + startIndex);
	},
	onParagraphBlockBegin: function () {
		this._output.push(this.getIndentation() + 'onParagraphBlockBegin');
	},
	onParagraphBlockEnd: function () {
		this._output.push(this.getIndentation() + 'onParagraphBlockEnd');
	},
	onQuoteBlockBegin: function () {
		this._output.push(this.getIndentation() + 'onQuoteBlockBegin');
	},
	onQuoteBlockEnd: function () {
		this._output.push(this.getIndentation() + 'onQuoteBlockEnd');
	},
	onBlockEnd: function (type) {
		this._indentationLevel--;
		this._output.push(this.getIndentation() + 'onBlockEnd: ' + type);
	},
	onNextBlock: function () {
		this._output.push(this.getIndentation() + 'onNextBlock');
	},
	onBlocksEnd: function () {
		this._indentationLevel--;
		this._output.push(this.getIndentation() + 'onBlocksEnd');
	},
	onContentsBegin: function () {
		this._output.push(this.getIndentation() + 'onContentsBegin');
		this._indentationLevel++;
	},
	onContentBegin: function (type) {
		this._output.push(this.getIndentation() + 'onContentBegin: ' + type);
		this._indentationLevel++;
	},
	onCodeContent: function (code) {
		this._output.push(this.getIndentation() + 'onCodeContent: ' + code);
	},
	onEmphasisContentBegin: function (level) {
		this._output.push(this.getIndentation() + 'onEmphasisContentBegin: ' + level);
	},
	onEmphasisContentEnd: function (level) {
		this._output.push(this.getIndentation() + 'onEmphasisContentEnd: ' + level);
	},
	onImageContent: function (uri, title, alternative) {
		this._output.push(this.getIndentation() + 'onImageContent: ' + uri + ' ~ ' + title + ' ~ ' + alternative);
	},
	onLineBreakContent: function (hard) {
		this._output.push(this.getIndentation() + 'onLineBreakContent: ' + hard);
	},
	onLinkContentBegin: function (uri, title) {
		this._output.push(this.getIndentation() + 'onLinkContentBegin: ' + uri + ' ~ ' + title);
	},
	onLinkContentEnd: function (uri, title) {
		this._output.push(this.getIndentation() + 'onLinkContentEnd: ' + uri + ' ~ ' + title);
	},
	onTextContent: function (text) {
		this._output.push(this.getIndentation() + 'onTextContent: ' + text);
	},
	onContentEnd: function (type) {
		this._indentationLevel--;
		this._output.push(this.getIndentation() + 'onContentEnd: ' + type);
	},
	onNextContent: function () {
		this._output.push(this.getIndentation() + 'onNextContent');
	},
	onContentsEnd: function () {
		this._indentationLevel--;
		this._output.push(this.getIndentation() + 'onContentsEnd');
	},
	getResult: function () {
		return this._output.join("\n");
	},
	getIndentation: function () {
		return this._padLeft('', ' ', this._indentationLevel * 4);
	},
	_padLeft: function (string, char, size) {
		while (string.length < size) {
			string = char + string;
		}
		return string;
	}
});

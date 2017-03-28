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

var DebugHandler = function () {
	this._handleComments = true;
	this._indentationLevel = 0;
	this._output = [];
};

DebugHandler.prototype.onDocumentBegin = function () {
	this._output.push(this.getIndentation() + 'onDocumentBegin');
	this._indentationLevel++;
};

DebugHandler.prototype.onDocumentEnd = function () {
	this._indentationLevel--;
	this._output.push(this.getIndentation() + 'onDocumentEnd');
};

DebugHandler.prototype.onBlocksBegin = function () {
	this._output.push(this.getIndentation() + 'onBlocksBegin');
	this._indentationLevel++;
};

DebugHandler.prototype.onBlockBegin = function (type) {
	this._output.push(this.getIndentation() + 'onBlockBegin: ' + type);
	this._indentationLevel++;
};

DebugHandler.prototype.onCodeBlock = function (code, hint) {
	this._output.push(this.getIndentation() + 'onCodeBlock: ' + hint + ' ~ ' + code);
};

DebugHandler.prototype.onCommentBlock = function (comment) {
	this._output.push(this.getIndentation() + 'onCommentBlock: ' + comment);
};

DebugHandler.prototype.onDivisionBlock = function () {
	this._output.push(this.getIndentation() + 'onDivisionBlock');
};

DebugHandler.prototype.onHeadingBlockBegin = function (level) {
	this._output.push(this.getIndentation() + 'onHeadingBlockBegin: ' + level);
};

DebugHandler.prototype.onHeadingBlockEnd = function (level) {
	this._output.push(this.getIndentation() + 'onHeadingBlockEnd: ' + level);
};

DebugHandler.prototype.onUnorderedListBlockBegin = function () {
	this._output.push(this.getIndentation() + 'onUnorderedListBlockBegin');
};

DebugHandler.prototype.onOrderedListBlockBegin = function (startIndex) {
	this._output.push(this.getIndentation() + 'onOrderedListBlockBegin: ' + startIndex);
};

DebugHandler.prototype.onListItemsBegin = function () {
	this._output.push(this.getIndentation() + 'onListItemsBegin');
};

DebugHandler.prototype.onListItemBegin = function () {
	this._output.push(this.getIndentation() + 'onListItemBegin');
};

DebugHandler.prototype.onListItemEnd = function () {
	this._output.push(this.getIndentation() + 'onListItemEnd');
};

DebugHandler.prototype.onNextListItem = function () {
	this._output.push(this.getIndentation() + 'onNextListItem');
};

DebugHandler.prototype.onListItemsEnd = function () {
	this._output.push(this.getIndentation() + 'onListItemsEnd');
};

DebugHandler.prototype.onUnorderedListBlockEnd = function () {
	this._output.push(this.getIndentation() + 'onUnorderedListBlockEnd');
};

DebugHandler.prototype.onOrderedListBlockEnd = function (startIndex) {
	this._output.push(this.getIndentation() + 'onOrderedListBlockEnd: ' + startIndex);
};

DebugHandler.prototype.onParagraphBlockBegin = function () {
	this._output.push(this.getIndentation() + 'onParagraphBlockBegin');
};

DebugHandler.prototype.onParagraphBlockEnd = function () {
	this._output.push(this.getIndentation() + 'onParagraphBlockEnd');
};

DebugHandler.prototype.onQuoteBlockBegin = function () {
	this._output.push(this.getIndentation() + 'onQuoteBlockBegin');
};

DebugHandler.prototype.onQuoteBlockEnd = function () {
	this._output.push(this.getIndentation() + 'onQuoteBlockEnd');
};

DebugHandler.prototype.onBlockEnd = function (type) {
	this._indentationLevel--;
	this._output.push(this.getIndentation() + 'onBlockEnd: ' + type);
};

DebugHandler.prototype.onNextBlock = function () {
	this._output.push(this.getIndentation() + 'onNextBlock');
};

DebugHandler.prototype.onBlocksEnd = function () {
	this._indentationLevel--;
	this._output.push(this.getIndentation() + 'onBlocksEnd');
};

DebugHandler.prototype.onContentsBegin = function () {
	this._output.push(this.getIndentation() + 'onContentsBegin');
	this._indentationLevel++;
};

DebugHandler.prototype.onContentBegin = function (type) {
	this._output.push(this.getIndentation() + 'onContentBegin: ' + type);
	this._indentationLevel++;
};

DebugHandler.prototype.onCodeContent = function (code) {
	this._output.push(this.getIndentation() + 'onCodeContent: ' + code);
};

DebugHandler.prototype.onEmphasisContentBegin = function (level) {
	this._output.push(this.getIndentation() + 'onEmphasisContentBegin: ' + level);
};

DebugHandler.prototype.onEmphasisContentEnd = function (level) {
	this._output.push(this.getIndentation() + 'onEmphasisContentEnd: ' + level);
};

DebugHandler.prototype.onImageContent = function (uri, title, alternative) {
	this._output.push(this.getIndentation() + 'onImageContent: ' + uri + ' ~ ' + title + ' ~ ' + alternative);
};

DebugHandler.prototype.onLineBreakContent = function (hard) {
	this._output.push(this.getIndentation() + 'onLineBreakContent: ' + hard);
};

DebugHandler.prototype.onLinkContentBegin = function (uri, title) {
	this._output.push(this.getIndentation() + 'onLinkContentBegin: ' + uri + ' ~ ' + title);
};

DebugHandler.prototype.onLinkContentEnd = function (uri, title) {
	this._output.push(this.getIndentation() + 'onLinkContentEnd: ' + uri + ' ~ ' + title);
};

DebugHandler.prototype.onTextContent = function (text) {
	this._output.push(this.getIndentation() + 'onTextContent: ' + text);
};

DebugHandler.prototype.onContentEnd = function (type) {
	this._indentationLevel--;
	this._output.push(this.getIndentation() + 'onContentEnd: ' + type);
};

DebugHandler.prototype.onNextContent = function () {
	this._output.push(this.getIndentation() + 'onNextContent');
};

DebugHandler.prototype.onContentsEnd = function () {
	this._indentationLevel--;
	this._output.push(this.getIndentation() + 'onContentsEnd');
};

DebugHandler.prototype.getResult = function () {
	return this._output.join("\n");
};

DebugHandler.prototype.getIndentation = function () {
	return this._padLeft('', ' ', this._indentationLevel * 4);
};

DebugHandler.prototype._padLeft = function (string, char, size) {
	while (string.length < size) {
		string = char + string;
	}
	return string;
};

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

var HandlerException = function (message) {
	this.message = message;
	this.name = "HandlerException";
};

HandlerException.prototype.toString = function () {
	return this.name + ': ' + this.message;
};

var HtmlHandlerTypes = {
	EMPHASIS_LEVEL_1: 1,
	EMPHASIS_LEVEL_2: 2
};

var HtmlHandler = function () {
	this._handleComments = true;
	this._tagBuilder = null;
	this._escapeHtml = false;
	this._breakSoftBreaks = false;
	this._htmlBuilder = null;
	this._blockStack = [];
	this._tagBuilder = new HtmlTagBuilder();
	this._htmlBuilder = new StringBuilder();
};

HtmlHandler.prototype.LINE_BREAK = "\n";

HtmlHandler.prototype.getHandleComments = function () {
	return this._handleComments;
};

//noinspection JSUnusedGlobalSymbols
HtmlHandler.prototype.setHandleComments = function (handleComments) {
	this._handleComments = handleComments;
	return this;
};

HtmlHandler.prototype.getTagBuilder = function () {
	return this._tagBuilder;
};

//noinspection JSUnusedGlobalSymbols
HtmlHandler.prototype.setTagBuilder = function (tagBuilder) {
	this._tagBuilder = tagBuilder;
	return this;
};

HtmlHandler.prototype.getEscapeHtml = function () {
	return this._escapeHtml;
};

HtmlHandler.prototype.setEscapeHtml = function (escapeHtml) {
	this._escapeHtml = escapeHtml;
	return this;
};

HtmlHandler.prototype.getBreakSoftBreaks = function () {
	return this._breakSoftBreaks;
};

HtmlHandler.prototype.setBreakSoftBreaks = function (breakSoftBreaks) {
	this._breakSoftBreaks = breakSoftBreaks;
	return this;
};

//noinspection JSUnusedGlobalSymbols
HtmlHandler.prototype.getHtmlBuilder = function () {
	return this._htmlBuilder;
};

//noinspection JSUnusedGlobalSymbols
HtmlHandler.prototype.getBlockStack = function () {
	return this._blockStack;
};

HtmlHandler.prototype.onDocumentBegin = function () {
};

HtmlHandler.prototype.onDocumentEnd = function () {
};

HtmlHandler.prototype.onBlocksBegin = function () {
};

HtmlHandler.prototype.onBlockBegin = function (type) {
	if (this._htmlBuilder.size() > 0) {
		this._htmlBuilder.append(this.LINE_BREAK);
	}
	this._blockStack.push(type);
};

HtmlHandler.prototype.onCodeBlock = function (code, hint) {
	this._htmlBuilder.append(
		this.getTagBuilder().buildTag(
			HtmlTagBuilderTypes.TYPE_CODE_BLOCK,
			code,
			{class: hint}
		)
	);
};

HtmlHandler.prototype.onCommentBlock = function (comment) {
	if (!this.getHandleComments()) {
		return;
	}
	this._htmlBuilder.append(
		this.getTagBuilder().buildTag(
			HtmlTagBuilderTypes.TYPE_COMMENT,
			comment
		)
	);
};

HtmlHandler.prototype.onDivisionBlock = function () {
	this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilderTypes.TYPE_DIVISION));
};

HtmlHandler.prototype.onHeadingBlockBegin = function (level) {
	this._htmlBuilder.append(
		this.getTagBuilder().buildTag(
			HtmlTagBuilderTypes.TYPE_HEADING_BEGIN,
			null,
			{},
			level
		)
	);
};

HtmlHandler.prototype.onHeadingBlockEnd = function (level) {
	this._htmlBuilder.append(
		this.getTagBuilder().buildTag(
			HtmlTagBuilderTypes.TYPE_HEADING_END,
			null,
			{},
			level
		)
	);
};

HtmlHandler.prototype.onUnorderedListBlockBegin = function () {
	this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilderTypes.TYPE_UNORDERED_LIST_BEGIN));
};

HtmlHandler.prototype.onOrderedListBlockBegin = function (startIndex) {
	this._htmlBuilder.append(
		this.getTagBuilder().buildTag(
			HtmlTagBuilderTypes.TYPE_ORDERED_LIST_BEGIN,
			null,
			{start: startIndex.toString()}
		)
	);
};

HtmlHandler.prototype.onListItemsBegin = function () {
};

HtmlHandler.prototype.onListItemBegin = function () {
	this._htmlBuilder
		.append(this.LINE_BREAK)
		.append(this.getTagBuilder().buildTag(HtmlTagBuilderTypes.TYPE_LIST_ITEM_BEGIN));
	this._blockStack.push('listitem');
};

HtmlHandler.prototype.onListItemEnd = function () {
	this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilderTypes.TYPE_LIST_ITEM_END));
	this._blockStack.pop();
};

HtmlHandler.prototype.onNextListItem = function () {
};

HtmlHandler.prototype.onListItemsEnd = function () {
	if (this._blockStack.length > 0) {
		this._htmlBuilder.append(this.LINE_BREAK, null);
	}
};

HtmlHandler.prototype.onUnorderedListBlockEnd = function () {
	this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilderTypes.TYPE_UNORDERED_LIST_END));
};

//noinspection JSUnusedLocalSymbols
HtmlHandler.prototype.onOrderedListBlockEnd = function (startIndex) {
	this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilderTypes.TYPE_ORDERED_LIST_END));
};

HtmlHandler.prototype.onParagraphBlockBegin = function () {
	this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilderTypes.TYPE_PARAGRAPH_BEGIN));
};

HtmlHandler.prototype.onParagraphBlockEnd = function () {
	this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilderTypes.TYPE_PARAGRAPH_END));
};

HtmlHandler.prototype.onQuoteBlockBegin = function () {
	this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilderTypes.TYPE_QUOTE_BEGIN));
};

HtmlHandler.prototype.onQuoteBlockEnd = function () {
	this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilderTypes.TYPE_QUOTE_END));
};

HtmlHandler.prototype.onBlockEnd = function (type) {
};

HtmlHandler.prototype.onNextBlock = function () {
};

HtmlHandler.prototype.onBlocksEnd = function () {
	if (this._blockStack.length > 0) {
		this._htmlBuilder.append(this.LINE_BREAK);
	}
};

HtmlHandler.prototype.onContentsBegin = function () {
};

HtmlHandler.prototype.onContentBegin = function (type) {
};

HtmlHandler.prototype.onCodeContent = function (code) {
	this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilderTypes.TYPE_CODE_INLINE, code));
};

HtmlHandler.prototype.onEmphasisContentBegin = function (level) {
	var tagType = HtmlTagBuilderTypes.TYPE_EMPHASIS_LEVEL_1_BEGIN;
	if (level === HtmlHandlerTypes.EMPHASIS_LEVEL_2) {
		tagType = HtmlTagBuilderTypes.TYPE_EMPHASIS_LEVEL_2_BEGIN;
	}
	this._htmlBuilder.append(this.getTagBuilder().buildTag(tagType));
};

HtmlHandler.prototype.onEmphasisContentEnd = function (level) {
	var tagType = HtmlTagBuilderTypes.TYPE_EMPHASIS_LEVEL_1_END;
	if (level === HtmlHandlerTypes.EMPHASIS_LEVEL_2) {
		tagType = HtmlTagBuilderTypes.TYPE_EMPHASIS_LEVEL_2_END;
	}
	this._htmlBuilder.append(this.getTagBuilder().buildTag(tagType));
};

HtmlHandler.prototype.onImageContent = function (uri, title, alternative) {
	this._htmlBuilder.append(
		this.getTagBuilder().buildTag(
			HtmlTagBuilderTypes.TYPE_IMAGE,
			null,
			{
				src: uri,
				title: title,
				alt: alternative
			}
		)
	);
};

HtmlHandler.prototype.onLineBreakContent = function (hard) {
	if (hard || this.getBreakSoftBreaks()) {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilderTypes.TYPE_LINE_BREAK));
	} else {
		this._htmlBuilder.append(this.LINE_BREAK, null);
	}
};

HtmlHandler.prototype.onLinkContentBegin = function (uri, title) {
	this._htmlBuilder.append(
		this.getTagBuilder().buildTag(
			HtmlTagBuilderTypes.TYPE_LINK_BEGIN,
			null,
			{
				href: uri,
				title: title
			}
		)
	);
};

//noinspection JSUnusedLocalSymbols,JSUnusedLocalSymbols
HtmlHandler.prototype.onLinkContentEnd = function (uri, title) {
	this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilderTypes.TYPE_LINK_END));
};

HtmlHandler.prototype.onTextContent = function (text) {
	if (this.getEscapeHtml()) {
		text = this._htmlEscape(text);
	}
	this._htmlBuilder.append(text);
};

HtmlHandler.prototype.onContentEnd = function (type) {
};

HtmlHandler.prototype.onNextContent = function () {
};

HtmlHandler.prototype.onContentsEnd = function () {
};

HtmlHandler.prototype.getResult = function () {
	return this._htmlBuilder.build();
};

HtmlHandler.prototype._htmlEscape = function (unsafe) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
};

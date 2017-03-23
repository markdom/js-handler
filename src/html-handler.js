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
	this.toString = function () {
		return this.name + ': ' + this.message;
	};
};

//noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
var HtmlHandler = BindedJsClass.extend({
	_handleComments: true,
	_tagBuilder: null,
	_escapeHtml: false,
	_breakSoftBreaks: false,
	_htmlBuilder: null,
	_blockStack: [],
	statics: {
		LINE_BREAK: "\n",
		EMPHASIS_LEVEL_1: 1,
		EMPHASIS_LEVEL_2: 2
	},
	construct: function () {
		this._tagBuilder = new HtmlTagBuilder();
		this._htmlBuilder = new StringBuilder();
	},
	getHandleComments: function () {
		return this._handleComments;
	},
	setHandleComments: function (handleComments) {
		this._handleComments = handleComments;
		return this;
	},
	getTagBuilder: function () {
		return this._tagBuilder;
	},
	setTagBuilder: function (tagBuilder) {
		this._tagBuilder = tagBuilder;
		return this;
	},
	getEscapeHtml: function () {
		return this._escapeHtml;
	},
	setEscapeHtml: function (escapeHtml) {
		this._escapeHtml = escapeHtml;
		return this;
	},
	getBreakSoftBreaks: function () {
		return this._breakSoftBreaks;
	},
	setBreakSoftBreaks: function (breakSoftBreaks) {
		this._breakSoftBreaks = breakSoftBreaks;
		return this;
	},
	getHtmlBuilder: function () {
		return this._htmlBuilder;
	},
	getBlockStack: function () {
		return this._blockStack;
	},
	onDocumentBegin: function () {
	},
	onDocumentEnd: function () {
	},
	onBlocksBegin: function () {
	},
	onBlockBegin: function (type) {
		if (this._htmlBuilder.size() > 0) {
			this._htmlBuilder.append(HtmlHandler.LINE_BREAK);
		}
		this._blockStack.push(type);
	},
	onCodeBlock: function (code, hint) {
		this._htmlBuilder.append(
			this.getTagBuilder().buildTag(
				HtmlTagBuilder.TYPE_CODE_BLOCK,
				code,
				{class: hint}
			)
		);
	},
	onCommentBlock: function (comment) {
		if (!this.getHandleComments()) {
			return;
		}
		this._htmlBuilder.append(
			this.getTagBuilder().buildTag(
				HtmlTagBuilder.TYPE_COMMENT,
				comment
			)
		);
	},
	onDivisionBlock: function () {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilder.TYPE_DIVISION));
	},
	onHeadingBlockBegin: function (level) {
		this._htmlBuilder.append(
			this.getTagBuilder().buildTag(
				HtmlTagBuilder.TYPE_HEADING_BEGIN,
				null,
				{},
				level
			)
		);
	},
	onHeadingBlockEnd: function (level) {
		this._htmlBuilder.append(
			this.getTagBuilder().buildTag(
				HtmlTagBuilder.TYPE_HEADING_END,
				null,
				{},
				level
			)
		);
	},
	onUnorderedListBlockBegin: function () {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilder.TYPE_UNORDERED_LIST_BEGIN));
	},
	onOrderedListBlockBegin: function (startIndex) {
		this._htmlBuilder.append(
			this.getTagBuilder().buildTag(
				HtmlTagBuilder.TYPE_ORDERED_LIST_BEGIN,
				null,
				{start: startIndex.toString()}
			)
		);
	},
	onListItemsBegin: function () {
	},
	onListItemBegin: function () {
		this._htmlBuilder
			.append(HtmlHandler.LINE_BREAK)
			.append(this.getTagBuilder().buildTag(HtmlTagBuilder.TYPE_LIST_ITEM_BEGIN));
		this._blockStack.push('listitem');
	},
	onListItemEnd: function () {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilder.TYPE_LIST_ITEM_END));
		this._blockStack.pop();
	},
	onNextListItem: function () {
	},
	onListItemsEnd: function () {
		if (this._blockStack.length > 0) {
			this._htmlBuilder.append(HtmlHandler.LINE_BREAK, null);
		}
	},
	onUnorderedListBlockEnd: function () {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilder.TYPE_UNORDERED_LIST_END));
	},
	onOrderedListBlockEnd: function (startIndex) {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilder.TYPE_ORDERED_LIST_END));
	},
	onParagraphBlockBegin: function () {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilder.TYPE_PARAGRAPH_BEGIN));
	},
	onParagraphBlockEnd: function () {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilder.TYPE_PARAGRAPH_END));
	},
	onQuoteBlockBegin: function () {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilder.TYPE_QUOTE_BEGIN));
	},
	onQuoteBlockEnd: function () {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilder.TYPE_QUOTE_END));
	},
	onBlockEnd: function (type) {
	},
	onNextBlock: function () {
	},
	onBlocksEnd: function () {
		if (this._blockStack.length > 0) {
			this._htmlBuilder.append(HtmlHandler.LINE_BREAK);
		}
	},
	onContentsBegin: function () {
	},
	onContentBegin: function (type) {
	},
	onCodeContent: function (code) {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilder.TYPE_CODE_INLINE, code));
	},
	onEmphasisContentBegin: function (level) {
		var tagType = HtmlTagBuilder.TYPE_EMPHASIS_LEVEL_1_BEGIN;
		if (level === HtmlHandler.EMPHASIS_LEVEL_2) {
			tagType = HtmlTagBuilder.TYPE_EMPHASIS_LEVEL_2_BEGIN;
		}
		this._htmlBuilder.append(this.getTagBuilder().buildTag(tagType));
	},
	onEmphasisContentEnd: function (level) {
		var tagType = HtmlTagBuilder.TYPE_EMPHASIS_LEVEL_1_END;
		if (level === HtmlHandler.EMPHASIS_LEVEL_2) {
			tagType = HtmlTagBuilder.TYPE_EMPHASIS_LEVEL_2_END;
		}
		this._htmlBuilder.append(this.getTagBuilder().buildTag(tagType));
	},
	onImageContent: function (uri, title, alternative) {
		this._htmlBuilder.append(
			this.getTagBuilder().buildTag(
				HtmlTagBuilder.TYPE_IMAGE,
				null,
				{
					src: uri,
					title: title,
					alt: alternative
				}
			)
		);
	},
	onLineBreakContent: function (hard) {
		if (hard || this.getBreakSoftBreaks()) {
			this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilder.TYPE_LINE_BREAK));
		} else {
			this._htmlBuilder.append(HtmlHandler.LINE_BREAK, null);
		}
	},
	onLinkContentBegin: function (uri, title) {
		this._htmlBuilder.append(
			this.getTagBuilder().buildTag(
				HtmlTagBuilder.TYPE_LINK_BEGIN,
				null,
				{
					href: uri,
					title: title
				}
			)
		);
	},
	onLinkContentEnd: function (uri, title) {
		this._htmlBuilder.append(this.getTagBuilder().buildTag(HtmlTagBuilder.TYPE_LINK_END));
	},
	onTextContent: function (text) {
		if (this.getEscapeHtml()) {
			text = this._htmlEscape(text);
		}
		this._htmlBuilder.append(text);
	},
	onContentEnd: function (type) {
	},
	onNextContent: function () {
	},
	onContentsEnd: function () {
	},
	getResult: function () {
		return this._htmlBuilder.build();
	},
	_htmlEscape: function (unsafe) {
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}
});

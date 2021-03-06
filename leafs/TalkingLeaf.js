const BSClientLeaf = require('./BSClientLeaf');
const ClientMouth = require('./../ClientMouth');

/**
 * `Leaf` that speaks `StaMP` messages (that have audio).
 */
class TalkingLeaf extends BSClientLeaf {
    /**
     *
     * @param {AudioContext} [audioContext=new AudioContext()]
     * @param {boolean} [speechEnabled=true]
     */
    constructor(audioContext, speechEnabled = true) {
        super();

        /**
         *
         * @type {AudioContext}
         * @private
         */
        this._audioContext = audioContext;
        /**
         *
         * @type {ClientMouth}
         * @private
         */
        this._mouth = new ClientMouth(audioContext);
        /**
         *
         * @type {boolean}
         * @private
         */
        this._speechEnabled = speechEnabled;
    }

    // region getters & setters
    // region speechEnabled (get & set)
    /**
     * Gets whether speech is enabled or disabled for this client.
     *
     * @return {boolean}
     */
    get speechEnabled() {
        return this._speechEnabled;
    }

    /**
     * Sets whether speech is enabled or disabled for this client.
     *
     * @param {boolean} speechEnabled
     */
    set speechEnabled(speechEnabled) {
        this._speechEnabled = speechEnabled;

        if (!this.speechEnabled && this._mouth) {
            this._mouth.shutup();
        }
    }

    // endregion
    // endregion

    /**
     * @inheritDoc
     *
     * @param {BotSocket.Protocol.Messages.RenderLetterData} renderLetterData
     * @protected
     * @override
     */
    processRenderLetterRequest(renderLetterData) {
        renderLetterData.letter.forEach(message => this._maybeSpeakMessage(message));
    }

    /**
     *
     * @param {StaMP.Protocol.Messages.StaMPMessage} message
     * @private
     */
    _maybeSpeakMessage(message) {
        if (this._mouth && this.speechEnabled && 'speech' in message) {
            this._mouth.speakMessage(message);
        }
    }
}

module.exports = TalkingLeaf;

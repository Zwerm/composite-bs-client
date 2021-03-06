// region required exceptions
const AbstractMethodCalledError = require('./../../exceptions/AbstractMethodCalledError');
// endregion

const BSClientLeaf = require('../BSClientLeaf');

/**
 * Abstract `Leaf` that handles managing & providing a `timezone` as and
 * when required during the usual operations of a `CompositeBSClient`.
 *
 * Create a new `Leaf` extending from this class, implement the abstract methods,
 * and you'll be rubbing elbows with the finest, having crumpets with her highness.
 *
 * @extends {BSClientLeaf}
 * @abstract
 */
class AbstractTimezoneLeaf extends BSClientLeaf {
    // region getters & setters
    /**
     * Gets the current timezone the BSClient is in.
     *
     * @return {string}
     * @abstract
     */
    get timezone() {
        throw new AbstractMethodCalledError();
    }

    // endregion

    /**
     * @inheritDoc
     *
     * @param {StaMP.Protocol.QueryMessage} query
     *
     * @return {StaMP.Protocol.QueryMessage}
     * @override
     */
    supplementStaMPQuery(query) {
        const lastResult = arguments[arguments.length - 1];

        return Object.assign(
            {},
            query,
            lastResult,
            { timezone: this.timezone }
        );
    }

    /**
     * @inheritDoc
     *
     * @param {StaMP.Protocol.EventMessage} event
     *
     * @return {StaMP.Protocol.EventMessage}
     * @override
     */
    supplementStaMPEvent(event) {
        const lastResult = arguments[arguments.length - 1];

        return Object.assign(
            {},
            event,
            lastResult,
            { timezone: this.timezone }
        );
    }
}

module.exports = AbstractTimezoneLeaf;

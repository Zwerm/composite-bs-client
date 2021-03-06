// region required exceptions
const AbstractMethodCalledError = require('./../../exceptions/AbstractMethodCalledError');
// endregion

const BSClientLeaf = require('../BSClientLeaf');

/**
 * Abstract `Leaf` that handles managing & providing a `userId` as and
 * when required during the usual operations of a `CompositeBSClient`.
 *
 * Create a new `Leaf` extending from this class, implement the abstract methods,
 * and you'll be rubbing elbows with the finest, having crumpets with her highness.
 *
 * @extends {BSClientLeaf}
 * @abstract
 */
class AbstractUserIdLeaf extends BSClientLeaf {
    // region getters & setters
    /**
     * Gets the id of the user that the BotSocket client is currently representing.
     *
     * @return {?string}
     * @abstract
     */
    get userId() {
        throw new AbstractMethodCalledError();
    }

    /**
     * Sets the id of the user that the BotSocket client is currently representing.
     *
     * @param {?string} userId
     * @abstract
     */
    set userId(userId) {
        throw new AbstractMethodCalledError();
    }

    // endregion

    /**
     * @inheritDoc
     *
     * @param {BotSocket.Protocol.Messages.ServerHandshakeData} serverHandshake
     * @override
     */
    processServerHandshake(serverHandshake) {
        this.userId = serverHandshake.userId || serverHandshake.clientId;
    }

    /**
     * @inheritDoc
     *
     * @param {BotSocket.Protocol.Messages.ClientHandshakeData} clientHandshake
     *
     * @return {BotSocket.Protocol.Messages.ClientHandshakeData}
     * @override
     */
    supplementClientHandshake(clientHandshake) {
        const lastResult = arguments[arguments.length - 1];

        this._commentOnUserIdType(this.userId);

        return Object.assign(
            {},
            clientHandshake,
            lastResult,
            { userId: this.userId }
        );
    }

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

        this._commentOnUserIdType(this.userId);

        return Object.assign(
            {},
            query,
            lastResult,
            {
                data: Object.assign(
                    {},
                    query.data,
                    lastResult ? lastResult.data : null,
                    { senderId: this.userId }
                )
            }
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

        this._commentOnUserIdType(this.userId);

        return Object.assign(
            {},
            event,
            lastResult,
            {
                data: Object.assign(
                    {},
                    event.data,
                    lastResult ? lastResult.data : null,
                    { senderId: this.userId }
                )
            }
        );
    }

    /**
     * Checks the type of the given `userId`,
     * and prints a warning comment to the console
     * if it's not either `null`, or of type `string`.
     *
     * @param {?string} userId the userId that should be type checked.
     *
     * @protected
     */
    _commentOnUserIdType(userId) {
        if (userId !== null && typeof userId !== 'string') {
            console.warn(
                `userId is of type ${typeof userId}, instead of string!`,
                `This will result in the server implicitly casting it!!`
            );
        }
    }
}

module.exports = AbstractUserIdLeaf;

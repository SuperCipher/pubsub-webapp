import dayjs from "dayjs"

export class Tweet
{
    constructor (publicKey, accountData) {
        this.publicKey = publicKey
        this.author = accountData.author
        this.timestamp = accountData.timestamp.toString()
        this.topic = accountData.topic
        this.content = accountData.content
    }

    get key () {
        return this.publicKey.toBase58()
    }

    get author_display () {
        const author = this.author.toBase58()
        return author.slice(0,4) + '..' + author.slice(-4)
    }

    get created_at () {
        return dayjs.unix(this.timestamp).format('lll')
    }

    get created_ago () {
        return dayjs.unix(this.timestamp).fromNow()
    }
}

export class Notification
{
    constructor (publicKey, accountData) {
        this.publicKey = publicKey
        this.notifier = accountData.notifier
        this.eventKey = accountData.eventKey
        this.timestamp = accountData.timestamp.toString()
        this.proof = accountData.proof
    }

    get key () {
        return this.publicKey.toBase58()
    }

    get notifier_display () {
        const notifier = this.notifier.toBase58()
        return notifier.slice(0,4) + '..' + notifier.slice(-4)
    }

    get created_at () {
        return dayjs.unix(this.timestamp).format('lll')
    }

    get created_ago () {
        return dayjs.unix(this.timestamp).fromNow()
    }
}

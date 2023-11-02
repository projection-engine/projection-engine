import uuid from "uuidv4"

export default function UUIDGen(): UUID{
    return uuid() as UUID
}

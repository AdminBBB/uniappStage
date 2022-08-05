export default function isPureObject (o) {
    return typeof o === 'object' && o !== null && !Array.isArray(o);
}

export function formatDate(isoString) {
    // return new Date(isoString).toLocaleDateString('en-US', {
    //     day: 'numeric', month: 'short', year: 'numeric'
    // });
    // console.log(new Date())
    const time = new Date();
    // console.log(time.toLocaleTimeString())

    const date = new Date(isoString).toLocaleDateString('en-US', {
        weekday: "short", day: 'numeric', month: 'short', year: 'numeric',
    });

    // return date + " " +" @ "+time.toLocaleTimeString() ;
    // console.log(date )
    return date;

}
export function formatChallengePageDate(isoString) {
    // return new Date(isoString).toLocaleDateString('en-US', {
    //     day: 'numeric', month: 'short', year: 'numeric'
    // });
    // console.log(new Date())
    const time = new Date(isoString);
    // console.log(time.toLocaleTimeString())

    const date = new Date(isoString).toLocaleDateString('en-US', {
        weekday: "short", day: 'numeric', month: 'short', year: 'numeric',
    });

     return date + " " +" @ "+ time.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}) ;
}
export function formatSubmissionsTimes(isoString) {
    // return new Date(isoString).toLocaleDateString('en-US', {
    //     day: 'numeric', month: 'short', year: 'numeric'
    // });
    const time = new Date(isoString);
    // console.log(time.toLocaleTimeString())


     return time.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}) ;


}

export function toIsoString(date) {
    const tzo = -date.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            return (num < 10 ? '0' : '') + num;
        };

    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        dif + pad(Math.floor(Math.abs(tzo) / 60)) +
        ':' + pad(Math.abs(tzo) % 60);
}
export function formatDate(isoString) {
    // return new Date(isoString).toLocaleDateString('en-US', {
    //     day: 'numeric', month: 'short', year: 'numeric'
    // });
    console.log(new Date())
    const time = new Date();
    console.log(time.toLocaleTimeString())

    const date = new Date(isoString).toLocaleDateString('en-US', {
        weekday: "short", day: 'numeric', month: 'short', year: 'numeric',
    });

    return date + " " +" @ "+time.toLocaleTimeString() ;

}
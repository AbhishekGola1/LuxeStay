// function wrapAsync(fn) {
//     return function(req, res, next) {
//         fn(req, res, next).catch(next);     // Ye line async function ke andar agar koi error aata hai to usse catch karke next() function ke through error handling middleware ko pass kar deti hai, jisse server crash nahi hota aur user-friendly error message dikhaya ja sakta hai
//     }
// }

//writing above code in other way
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}
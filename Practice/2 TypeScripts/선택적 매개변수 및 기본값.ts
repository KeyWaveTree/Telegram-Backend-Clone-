function greet(name:string, age?:number):string{
    return age ? `Hello ${name}. You are ${age} years old.` : `Hello ${name}`;
}
console.log(greet("anana"))
console.log(greet("aa", 20))
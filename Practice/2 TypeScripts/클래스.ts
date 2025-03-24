class Animal{
    private name:string;
    constructor(name:string)
    {
        this.name = name;
    }

    speak():void{
        console.log(`${this.name} makes a noise`);
    }
}

let a:Animal = new Animal("people");
a.speak(); 

class Dog extends Animal
{
    constructor(name:string)
    {
        super(name);
    }
    speak():void{
        console.log("woof!")
    }
}

let doggy:Dog = new Dog("people");
doggy.speak();
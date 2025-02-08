class Friend {
    constructor(_name, _number) {
        this.name = _name;
        this.number = _number;
    }

    report(){
        console.log(this.name, this.number);
        console.log(`Name: ${this.name}, Number: ${this.number}`);
    }
}


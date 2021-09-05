export class Node {
    id: number;
    name: string;
    description: string;
    parent: number;
    read_only: number;
    children: Node[];
    
    constructor(id: number, name: string, desc: string, parent: number, read_only: number ) {
       this.id = id;
       this.name = name;
       this.description = desc;
       this.parent = parent;
       this.read_only = read_only;
       this.children = [];
    }

    reset() {
        this.id = 0;
        this.name = '';
        this.description = '';
        this.parent = 0;
        this.read_only = 0;
        this.children = [];
    }
}

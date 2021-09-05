import { Component } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { NodeService } from './services/node.service';
import {Node} from './Models/node.model';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'tree-node-web-ui02';
  nodes: Node[] = [];

  constructor(private service: NodeService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.service.get().subscribe((data: any[])=>{
      data = data.sort((a, b) => a.id - b.id );
      this.nodes = [];
      for(let i = 0; i < data.length; ++i) {
        const newNode = 
          new Node(data[i].id, data[i].name, data[i].description, data[i].parent, data[i].read_only)
          this.nodes.push(newNode);
      }
      for(let i = 0; i < this.nodes.length; ++i) {
        if(this.nodes[i].parent != 0 && this.nodes[i].children){
          try {
            this.nodes.filter(n => n.id == this.nodes[i].parent)[0].children.push(this.nodes[i]);
          }
          catch {
            debugger;

          }
        }
      }
      debugger;
      this.dataSource = new ArrayDataSource(this.nodes.filter(n => n.parent == 0));
    }); 
  }


  treeControl = new NestedTreeControl<Node> (node => node.children);
  dataSource = new ArrayDataSource(this.nodes.filter(n => n.parent == 0));

  hasChild = (_: number, node: Node) => !!node.children && node.children.length > 0;

  changedValue(e: any) {

    let n = this.nodes.filter(n => n.id == +e.id)[0]; //
    n.name = e.name;
    
    this.service.edit(n.id, n.name)
      .subscribe((data: any[])=>{
        console.log("put", data);
      });
  }

  refresh() {
    this.service.get().subscribe((data: any[])=>{
      // debugger;
      data = data.sort((a, b) => a.id - b.id );
      this.nodes = [];
      for(let i = 0; i < data.length; ++i) {
        const newNode = 
          new Node(data[i].id, data[i].name, data[i].description, data[i].parent, data[i].read_only)
          this.nodes.push(newNode);
      }
      
      for(let i = 0; i < this.nodes.length; ++i) {
        if(this.nodes[i].parent != 0){
          this.nodes.filter(n => n.id == this.nodes[i].parent)[0].children.push(this.nodes[i]);
        }
      }
      debugger;
      this.dataSource = new ArrayDataSource(this.nodes.filter(n => n.parent == 0));
    }); 
  }
  
  closeResult = '';
  newNode: Node = new Node(0, '','', 0, 0);
  
  open(content:any, parent: number) {
    
    this.newNode.parent = parent;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
    .result.then((result) => {
      // debugger;
      console.log(`Closed with: ${result}`);
      console.log(this.newNode);

      if(result == 'Save click') {
        this.service.post(this.newNode)
        .subscribe((data: any)=>{
          this.newNode.reset();
          this.refresh();
        });
      }

      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //debugger;
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {

    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  delete(id: number) {

    this.service.delete(id)
      .subscribe((data: any)=>{
         
        const itemIndex = this.nodes.findIndex(n => n["id"] === id);
        this.nodes.splice(itemIndex, 1);
        
        this.refresh();
      });
      
  }
}

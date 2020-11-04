import { Component, OnInit } from '@angular/core';
import { StudyService } from '../services/study-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TagService } from '../services/tag-service.service';
import { TagDTO } from '../DTO/tagDTO';
import { DndDropEvent } from 'ngx-drag-drop';
import { TagListDTO } from '../DTO/tagListDTO';

export interface DraggableTag {
  tag:TagDTO,
  effectAllowed: string,
  disable: boolean,
  handle: boolean
};

@Component({
  selector: 'app-study-view',
  templateUrl: './study-view.component.html',
  styleUrls: ['./study-view.component.css']
})
export class StudyViewComponent implements OnInit {
  study: any;

  selectedId: string;

  isShow = false;  
  
  tagToAdd : TagDTO;

  draggableTags: DraggableTag[];

  searchIds : number[];

  droppedTagsOnStudy: any[];
  droppedTagsOnConditionList: any[];
  droppedTagsOnStudyType: any[];
  droppedTagsOnIntervention: any[];
  droppedTagsOnCollaborator:any[];
  droppedTagsOnDescription:any[];
  droppedTagsOnLocations:any[];
  droppedTagsOnStatus:any[];

  constructor(private _studyService: StudyService, private _tagService: TagService, private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    this.tagToAdd = new TagDTO();
    this.searchIds = [];

    this._route.params.subscribe((params) => {
      this.initArrays();

      this.selectedId = params.id;
      this._studyService.get(this.selectedId)
        .subscribe( data => {

          this.study = data;
          console.log(this.study)
          this._tagService.getAll()
            .subscribe( data => {
              for(let t of data){
                this.makeTagDraggable(t);
              }
            //this._tagService.getAllTagLists(this.study.nctId)
            //  .subscribe( data => {
                for(let tagList of this.study.tagLists){
                  switch(tagList.section){
                    case "study":
                      this.droppedTagsOnStudy.push(this.draggableTags.find(x => x.tag.id === tagList.tagId).tag);
                      break;
                    case "conditionList":
                      this.droppedTagsOnConditionList.push(this.draggableTags.find(x => x.tag.id === tagList.tagId).tag);
                      break;
                    case "studyType":
                      this.droppedTagsOnStudyType.push(this.draggableTags.find(x => x.tag.id === tagList.tagId).tag);
                      break;
                    case "status":
                      this.droppedTagsOnStatus.push(this.draggableTags.find(x => x.tag.id === tagList.tagId).tag);
                      break;
                    case "intervention":
                      this.droppedTagsOnIntervention.push(this.draggableTags.find(x => x.tag.id === tagList.tagId).tag);
                      break;
                    case "description":
                      this.droppedTagsOnDescription.push(this.draggableTags.find(x => x.tag.id === tagList.tagId).tag);
                      break;
                    case "locations":
                      this.droppedTagsOnLocations.push(this.draggableTags.find(x => x.tag.id === tagList.tagId).tag);
                      break;
                    case "collaborator":
                      this.droppedTagsOnCollaborator.push(this.draggableTags.find(x => x.tag.id === tagList.tagId).tag);
                      break;
                    default:
                      continue;
                  }
                }
              });
            });
        });
    //});
    this.searchIds = JSON.parse(window.localStorage.getItem("SearchIds"));
    
  }

  initArrays(){
    this.droppedTagsOnStudy = [];
    this.droppedTagsOnStudyType = [];
    this.droppedTagsOnDescription = [];
    this.droppedTagsOnConditionList = [];
    this.droppedTagsOnIntervention = [];
    this.droppedTagsOnCollaborator = [];
    this.droppedTagsOnStatus = [];
    this.droppedTagsOnLocations = [];
    this.draggableTags = [];
  }

  nextStudy(){
    const currentIndex = this.searchIds.indexOf(Number(this.selectedId));
    const nextIndex = (currentIndex + 1) % this.searchIds.length;

    if(this.searchIds[nextIndex] !== undefined){
      this.initArrays();
      this._router.navigate(["/study/" + this.searchIds[nextIndex]]);
    }
  }

  previousStudy(){
    const currentIndex = this.searchIds.indexOf(Number(this.selectedId));
    const previousIndex = (currentIndex - 1) % this.searchIds.length;
    
    if(this.searchIds[previousIndex] !== undefined){
      this.initArrays();
      this._router.navigate(["/study/" + this.searchIds[previousIndex]]);
    }
  }

  makeTagDraggable(t: any){

    let draggableTag = {
      tag: t,
      effectAllowed: "all",
      disable: false,
      handle: false
    };
    this.draggableTags.push(draggableTag);
  }

  addTag(){
    this._tagService.post(this.tagToAdd).subscribe( data => {
      this.isShow = !this.isShow;
      this.tagToAdd.Description = "";
      this.makeTagDraggable(data);
    });
  }

  deleteTag(tagId: string){
    this._tagService.delete(tagId).subscribe(() =>{
      let tagToDelete;
     
      //delete from available tags
      tagToDelete = this.draggableTags.find(x => x.tag.id === tagId);
      this.draggableTags = this.draggableTags.filter(item => item !== tagToDelete);
      console.log(tagToDelete)
      console.log(this.droppedTagsOnStudy)

      //delete from attached tags
      this.droppedTagsOnStudy = this.droppedTagsOnStudy.filter(item => item.id !== tagToDelete.tag.id);
      this.droppedTagsOnStudyType = this.droppedTagsOnStudyType.filter(item => item.id !== tagToDelete.tag.id);
      this.droppedTagsOnConditionList = this.droppedTagsOnConditionList.filter(item => item.id !== tagToDelete.tag.id);
      this.droppedTagsOnDescription = this.droppedTagsOnDescription.filter(item => item.id !== tagToDelete.tag.id);
      this.droppedTagsOnIntervention = this.droppedTagsOnIntervention.filter(item => item.id !== tagToDelete.tag.id);
      this.droppedTagsOnLocations = this.droppedTagsOnLocations.filter(item => item.id !== tagToDelete.tag.id);
      this.droppedTagsOnStatus = this.droppedTagsOnStatus.filter(item => item.id !== tagToDelete.tag.id);
      this.droppedTagsOnCollaborator = this.droppedTagsOnCollaborator.filter(item => item.id !== tagToDelete.tag.id);


    });
  }

  deleteAttachedTag(tagId: string, droppedTagsName:string){
    let tagToDelete;
    let tagListDTO = new TagListDTO();
    tagListDTO.NCTId = this.study.nctId;
    tagListDTO.TagId = tagId;

    switch(droppedTagsName){
      case "droppedTagsOnStudy":
          tagToDelete = this.droppedTagsOnStudy.find(x => x.id === tagId);
          tagListDTO.Section = "study";
          this.droppedTagsOnStudy = this.droppedTagsOnStudy.filter(item => item !== tagToDelete);
        break;
      case "droppedTagsOnConditionList":
        tagToDelete = this.droppedTagsOnConditionList.find(x => x.id === tagId);
        tagListDTO.Section = "conditionList";
        this.droppedTagsOnConditionList = this.droppedTagsOnConditionList.filter(item => item !== tagToDelete);
      break;
      case "droppedTagsOnStudyType":
        tagToDelete = this.droppedTagsOnStudyType.find(x => x.id === tagId);
        tagListDTO.Section = "studyType";
        this.droppedTagsOnStudyType = this.droppedTagsOnStudyType.filter(item => item !== tagToDelete);
      break;
      case "droppedTagsOnDescription":
        tagToDelete = this.droppedTagsOnDescription.find(x => x.id === tagId);
        tagListDTO.Section = "description";
        this.droppedTagsOnDescription = this.droppedTagsOnDescription.filter(item => item !== tagToDelete);
      break;
      case "droppedTagsOnStatus":
          tagToDelete = this.droppedTagsOnStatus.find(x => x.id === tagId);
          tagListDTO.Section = "status";
          this.droppedTagsOnStatus = this.droppedTagsOnStatus.filter(item => item !== tagToDelete);
        break;
      case "droppedTagsOnIntervention":
        tagToDelete = this.droppedTagsOnIntervention.find(x => x.id === tagId); 
        tagListDTO.Section = "intervention";
        this.droppedTagsOnIntervention = this.droppedTagsOnIntervention.filter(item => item !== tagToDelete);
      break;
      case "droppedTagsOnLocations":
        tagToDelete = this.droppedTagsOnLocations.find(x => x.id === tagId); 
        tagListDTO.Section = "locations";
        this.droppedTagsOnLocations = this.droppedTagsOnLocations.filter(item => item !== tagToDelete);
      break;
      case "droppedTagsOnCollaborator":
        tagToDelete = this.droppedTagsOnCollaborator.find(x => x.id === tagId); 
        tagListDTO.Section = "collaborator";
        this.droppedTagsOnCollaborator = this.droppedTagsOnCollaborator.filter(item => item !== tagToDelete);
      break;
      default:
        return;
    }

    this._tagService.deleteAttachedTag(tagListDTO).subscribe( response => {
      console.log(response);
    });
    
  }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

  onDragStart(event:DragEvent) {
  }
  
  onDragEnd(event:DragEvent) {
    
  }
  
  onDraggableCopied(event:DragEvent) {
    
  }
  
  onDraggableLinked(event:DragEvent) {
      
  }
    
  onDraggableMoved(event:DragEvent) {
    
  }
      
  onDragCanceled(event:DragEvent) {
    
  }
  
  onDragover(event:DragEvent) {
    
  }
  
  onDrop(event:DndDropEvent) {
    console.log(event)
    let tagListDTO: TagListDTO = new TagListDTO();
      tagListDTO.NCTId = this.study.nctId;
      tagListDTO.TagId = event.data.id;
      tagListDTO.Section = event.event.toElement.id;

    switch(event.event.toElement.id) {    
      case "studyTitle":
        if(this.droppedTagsOnStudy.find(x => x.id === event.data.id) !== undefined){
          return;
        }
        this.droppedTagsOnStudy.push(event.data);
        tagListDTO.Section = "study";
        break;
      case "conditionList":
        if(this.droppedTagsOnConditionList.find(x => x.id === event.data.id) !== undefined){
          return;
        }
        this.droppedTagsOnConditionList.push(event.data);
        break;
      case "studyType":
        if(this.droppedTagsOnStudyType.find(x => x.id === event.data.id) !== undefined){
          return;
        }
        this.droppedTagsOnStudyType.push(event.data);
        break;
        case "intervention":
          if(this.droppedTagsOnIntervention.find(x => x.id === event.data.id) !== undefined){
            return;
          }
          this.droppedTagsOnIntervention.push(event.data);
          break;
        case "description":
          if(this.droppedTagsOnDescription.find(x => x.id === event.data.id) !== undefined){
            return;
          }
          this.droppedTagsOnDescription.push(event.data);
          break;
        case "status":
          if(this.droppedTagsOnStatus.find(x => x.id === event.data.id) !== undefined){
            return;
          }
          this.droppedTagsOnStatus.push(event.data);
          break;
        case "locations":
          if(this.droppedTagsOnLocations.find(x => x.id === event.data.id) !== undefined){
            return;
          }
          this.droppedTagsOnLocations.push(event.data);
          break;
        case "collaborator":
          if(this.droppedTagsOnCollaborator.find(x => x.id === event.data.id) !== undefined){
            return;
          }
          this.droppedTagsOnCollaborator.push(event.data);
          break;
      default:
        return;
    }
    this._tagService.attachTag(tagListDTO).subscribe( data => {
      console.log(data);
    });
  }

}
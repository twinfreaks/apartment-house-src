import {Component, OnInit, EventEmitter, Output} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {BlogHttpService} from "../../../services/blog-http.service";
import {BlogDetail} from "../../../models/blog-detail";
import {Blog} from "../../../models/blog";
import {CommentsHttpService} from "../../../services/comments-http.service";
import * as _ from "lodash";
import {AppConfig} from "../../../../app.config";
import {GalleryHttpService} from "../../../services/gallery-http.service";
import {toString} from "@ng-bootstrap/ng-bootstrap/util/util";

@Component({
  selector:    'app-blog-single-page',
  templateUrl: 'blog-single-page.component.html',
  styleUrls:   ['blog-single-page.component.scss']
})
export class BlogSinglePageComponent implements OnInit {
  
  @Output() changePage = new EventEmitter<boolean>();
  blogId: number;
  blogs: Blog[] = [];
  singleBlog: BlogDetail = null;
  blogPrev: BlogDetail = null;
  blogNext: BlogDetail = null;
  showAllBlog: boolean;
  isAdmin: boolean;
  error: any;
  currentUrl: string;
  filesUrl: string = this.config.getConfig('files');
  uploadDestination: string = this.config.getConfig('uploadDestinationForBlogs');
  defaultBlogLogo: string = this.config.getConfig('defaultBlogLogoUrl');
  galleryImages = [];
  photoPath = this.config.getConfig('files') + '/blogs/';
  photoUrls = [];
  author: any;
  
  constructor(private blogHttpService: BlogHttpService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private commentsHttpService: CommentsHttpService,
              private config: AppConfig,
              private galleryHttpService: GalleryHttpService) {
    activatedRoute.params.subscribe(
        (param: any) => this.blogId = Number(param['blogId'])
    );
  }
  
  ngOnInit() {
    this.isAdmin = this.commentsHttpService.isAdmin();
    this.getNearBlogs(this.blogId);
    this.currentUrl = _.split(window.location.pathname, '/')[1];
  }
  
  getGalleryImages(id) {
    this.galleryHttpService.getGallery(id)
        .subscribe(
            (data) => {
              this.photoUrls = data['data'];
              _.forEach(this.photoUrls, (value) => {
                this.galleryImages.push({'thumbnail': this.photoPath + value.photoUrl, 'image': this.photoPath + value.photoUrl});
              });
              this.photoUrls = [];
            },
            (error) => {
              this.error = error;
              console.log(error);
            }
        );
  }
  
  getNearBlogs(blogId) {
    this.blogHttpService.getNearBlogs(blogId)
        .subscribe(
            (data) => {
              this.blogs = data['data'];
              this.singleBlog = this.blogs['blog'];
              this.blogPrev = this.blogs['blogPrev'];
              this.blogNext = this.blogs['blogNext'];
              this.getAuthorInfo();
            },
            (error) => {
              this.error = error;
              console.log(error);
            }
        );
    this.scrollTop();
    this.galleryImages = [];
    this.getGalleryImages(this.blogId);
  }
  
  changeBlog(n: string) {
    this.changePageEmit();
    if (n === 'prev' && this.blogPrev) {
      this.router.navigate([this.currentUrl, 'blogs', this.blogPrev['id']]);
      this.blogId = this.blogPrev['id'];
    } else if (n === 'next' && this.blogNext) {
      this.router.navigate([this.currentUrl, 'blogs', this.blogNext['id']]);
      this.blogId = this.blogNext['id'];
    } else return;
    this.getNearBlogs(this.blogId);
    this.commentsHttpService.commentsToShow = this.config.getConfig('commentsAndBlog').commentsToShowScrollStep;
  }
  
  getAuthorInfo() {
    this.commentsHttpService.getAdminInfo(toString(this.singleBlog.admin))
        .subscribe(
            (data) => {
                this.author = data['data'][0];
            },
            (error) => {
              this.error = error;
              console.log(error);
            })
  }
  
  changePageEmit() {
    this.changePage.emit();
  }
  
  showAllBlogToggle() {
    this.showAllBlog = !this.showAllBlog;
  }
  
  scrollTop() {
    window.scrollTo(0, 0);
  }
  
  checkDefaultLogo(logoUrl: any) {
    if (logoUrl) {
      return this.filesUrl + '/' + this.uploadDestination + '/' + logoUrl;
    }
    return this.defaultBlogLogo;
  };
}
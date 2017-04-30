import {Component, OnInit} from "@angular/core";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {ConfirmationService} from "primeng/primeng";
import * as _ from "lodash";

import {AuthAppService} from "app/auth/services/auth-app.service";
import {BlogHttpService} from "app/shared/services/blog-http.service";
import {Blog} from "app/shared/models/blog";
import {AppConfig} from "app/app.config";

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
  providers: [ConfirmationService]
})
export class BlogListComponent implements OnInit {
  throttle = this.config.getConfig('infiniteScroll')['throttle'];
  scrollDistance = this.config.getConfig('infiniteScroll')['scrollDistance'];
  blogs: Blog[] =[];
  page: number = 1;
  totalPage: number;
  isLoading: boolean = true;
  isInhabitant: boolean;
  filesUrl = this.config.getConfig('files');
  uploadDestination = this.config.getConfig('uploadDestinationForBlogs');
  truncateLength = this.config.getConfig('truncateLengthShotBlog');
  defaultBlogLogo = this.config.getConfig('defaultBlogLogoUrl');
  noBlogs: boolean = false;
  sendingDeleteToServer: boolean = false;

  constructor(private blogHttpService: BlogHttpService,
              private toastrService: ToastrService,
              private translateService: TranslateService,
              private authAppService: AuthAppService,
              private confirmationService: ConfirmationService,
              private config: AppConfig) {
  }

  checkRole() {
    let roles = this.authAppService.getRoles();
    this.isInhabitant = _.includes(roles, "inhabitant");
  };

  ngOnInit() {
    this.checkRole();
    this.getBlogsForPagePagination(this.page);
  };

  getBlogsForPagePagination(page: number) {
    this.blogHttpService.getBlogsForPagePagination(page)
      .subscribe(
        (data) => {
          if (data['data']['blogs'].length === 0) {
            this.noBlogs = true;
            return;
          }
          let blogsPerPage: Blog[] = data['data']['blogs'];
          _.forEach(blogsPerPage, (blog) => {
            if (this.isInhabitant && !blog.isActive) {
              return;
            }
            blog.publicatedFrom = new Date(blog.publicatedFrom);
            this.blogs.push(blog);
          });
          this.totalPage = data['data']['totalPage'];
        },
        (err: any) => {
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_GET_ERROR'));
        },
        () => {
          this.isLoading = false;
        }
      );
  };

  changeActiveState(blog: Blog) {
    let isActive: boolean,
        blogToUpd = Object.assign({}, blog);
    blogToUpd.isActive = (blog.isActive) ? false : true;
    this.blogHttpService.putBlog(blogToUpd)
      .subscribe(
        (data) => {
          isActive = data['data'][0]['isActive'];
        },
        (err: any) => {
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_UPDATE_ERROR'));
        },
        () => {
          let message: string = (isActive) ? 'BLOG_IS_PUBLICATED' : 'BLOG_IS_UNPUBLICATED';
          this.toastrService.success(this.translateService.instant(message));
          blog.isActive = isActive;
        }
      );
  };

  deleteBlog(id: number) {
    this.sendingDeleteToServer = true;
    this.blogHttpService.deleteBlogById(id)
      .subscribe(
        (data) => {},
        (err:any) => {
          this.sendingDeleteToServer = false;
          this.toastrService.error(err.toString(), this.translateService.instant('SERVER_DELETE_ERROR'));
        },
        () => {
          let indexOfDeleted = _.findIndex(this.blogs, (blog) => {
            return blog.id === id;
          });
          this.blogs.splice(indexOfDeleted, 1);
          this.sendingDeleteToServer = false;
        }
      )
  };

  onScrollDown() {
    if (this.page < this.totalPage && !this.isLoading) {
      this.page++;
      this.isLoading = true;
      this.getBlogsForPagePagination(this.page);
    }
  };

  confirmBlogDeleting(id: number) {
    this.confirmationService.confirm({
      message: this.translateService.instant("ACCEPTING_DELETE_BLOG"),
      accept: () => {
        this.deleteBlog(id);
      }
    });
  };

  checkDefaultLogo(logoUrl: string) {
    if (logoUrl) {
      return this.filesUrl + '/' + this.uploadDestination + '/' + logoUrl;
    }
    return this.defaultBlogLogo;
  };
}

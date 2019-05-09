import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'ck-pagination',
  templateUrl: './ck-pagination.component.html',
  styleUrls: ['./ck-pagination.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CkPaginationComponent implements OnInit {
  // 輸入
  // totalPages是從後端返回的總頁數
  // itemSize是預計每一個頁面元素的寬度（以px計算，有em需求的人可以從下面修改）
  // currentPage是當前頁數

  @Input() totalPages: number;
  @Input() itemSize: number = 30;
  @Input() showItemSize: number = 5;
  @Input() currentPage: number;

  // 輸出
  // pageSelect是使用者選擇之後Return的頁數

  @Output()
  pageSelect = new EventEmitter<number>();

  // 宣告型態
  // paginationToggle用來判斷打開或關閉導航欄
  // items 為放入頁數元素的Array，有需要改成中文字的注意Value
  // containerWidth為容器寬度
  // containerHeight容器高度
  paginationToggle: boolean;
  items: Array<number>;
  containerWidth: number;
  containerHeight: number;
  // viewportStyle為Scroll容器的Style，可按需求加入
  viewportStyle: {
    width?: string;
    height?: string;
  };
  // containerStyle為整個元件容器的Style，主要用來蓋住Scroll Bar的，
  // 如果要露出Scroll bar 可以選擇把這層拿掉
  containerStyle: {
    width?: string;
    height?: string;
  };
  // itemStyle為個別頁數按鈕的Style，可按需求修正字體大小等等
  itemStyle: {
    width?: string;
    height?: string;
    'font-size'?: string;
  };
  // 使用Angular Material CDK scrolling

  @ViewChild('scrollComponent')
  private scrollViewport: CdkVirtualScrollViewport;

  constructor() { }

  ngOnInit() {
    // 初始元件參數，預設關閉導航
    // 按照總頁數生成頁數Array，有從0開始的可以去掉+1
    this.paginationToggle = false;
    this.items = Array.from({ length: this.totalPages }).map((_, i) => i + 1);
    // 如果總頁數小於整個元件容器的寬度，就縮小整個元件容器的寬度
    // 以符合總頁數，可按照需求改為定值
    if (this.totalPages < this.showItemSize) {
      this.showItemSize = this.totalPages;
    }
    // 整個元件容器的寬度等於個別頁數寬度乘上每次顯示頁數
    this.containerWidth = this.itemSize * this.showItemSize;
    // 整個元件容器的高度等於個別頁數高度
    this.containerHeight = this.itemSize;
    // Scroll Container的長寬設定，30px是用來遮著Scroll Bar, 寬度的1px是用來符合Border的元素
    this.viewportStyle = {
      width: this.containerWidth + 1 + 'px',
      height: this.containerHeight + 30 + 'px'
    };
    this.containerStyle = {
      width: '0px',
      //2是上下border加總
      height: this.containerHeight + 2 + 'px'
    };
    // itemStyle為個別頁數按鈕的Style，可按需求修正字體大小等等 這邊是用30px的容器放入12px的字體
    this.itemStyle = {
      width: this.itemSize + 'px',
      height: this.itemSize + 'px',
      'font-size': this.itemSize * 12 / 30 + 'px'
    };
  }


  // 打開選單
  openPagination() {
    // 如果總頁數大於1才能打開
    if (this.totalPages > 1) {
      this.paginationToggle = !this.paginationToggle;
      if (this.paginationToggle) {
        // 打開的時候Scroll自動跳轉到當前頁面，這邊預設放在中間位址
        const i = Math.floor(this.currentPage - (this.showItemSize / 2));
        this.scrollViewport.scrollToIndex(i);
        this.containerStyle.width = this.containerWidth + 1 + 'px';
      } else {
        this.containerStyle.width = '0px';
      }
    }
  }
  // 右鍵的功能
  barScrollRight() {
    // 如果打開導航的話就滾動Scroll
    if (this.paginationToggle) {
      const offset = this.scrollViewport.measureScrollOffset();
      this.scrollViewport.scrollToOffset(offset + this.containerWidth, 'smooth');
    } else {
      // 如果關閉導航的話就換下一頁
      // 另外判斷超過總頁數的話就不動作
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
        this.pageSelect.emit(this.currentPage);
      }
    }
  }
  // 左鍵的功能
  barScrollLeft() {
    // 如果打開導航的話就滾動Scroll
    if (this.paginationToggle) {
      const offset = this.scrollViewport.measureScrollOffset();
      this.scrollViewport.scrollToOffset(offset - this.containerWidth, 'smooth');
    } else {
      // 如果關閉導航的話就換上一頁
      // 另外判斷低於1頁數的話就不動作
      if (this.currentPage > 1) {
        this.currentPage -= 1;
        this.pageSelect.emit(this.currentPage);
      }
    }
  }
  // 按下頁數的行為
  onButtonClick(page) {
    // 當前頁數改為按下頁數(如果改成其他字請記得換成index)
    this.currentPage = page;
    this.openPagination();
    this.pageSelect.emit(this.currentPage);
  }
  // 直接打入頁碼的行為
  inputChange(eventTarget) {
    // 轉型，沒有轉型會一律看成String
    let inputValue = Number(eventTarget.value);
    // 判斷輸入的數字，大於總頁數就以最後一頁為主
    // 判斷輸入的數字，小於1就以第一頁為主
    // 亂打字就保持當前頁面
    if (inputValue > this.totalPages) {
      this.currentPage = this.totalPages;
    } else if (inputValue <= 0) {
      this.currentPage = 1;
    } else {
      if (isNaN(inputValue)) {
        eventTarget.value = this.currentPage;
      } else {
        this.currentPage = inputValue;
      }
    }
    let i = Math.floor(this.currentPage - (this.showItemSize / 2));
    // 這邊是一樣轉動Scroll，如果此元件放在Layout就一樣要有動作
    this.scrollViewport.scrollToIndex(i);
    this.pageSelect.emit(this.currentPage);
  }
}
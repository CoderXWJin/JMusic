<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{getModeText}}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll ref="listContent" class="list-content" :data="playlist" :refreshDelay="100">
          <transition-group name="list" tag="ul">
            <li @click="selectItem(item, index)" ref="listItem" class="item" v-for="(item, index) in sequenceList" :key="item.id">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSongShow">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <add-song ref="addSong"></add-song>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
    </div>
  </transition>
</template>
<script>
import Scroll from 'base/scroll/scroll';
import Confirm from 'base/confirm/confirm';
import AddSong from 'components/add-song/add-song';
import {mapGetters, mapMutations, mapActions} from 'vuex';
import {playMode} from 'common/js/config';
import {playerMixin} from 'common/js/mixin'; // 与player公用的JS
export default {
  name: 'playlist',
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false
    };
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  },
  methods: {
    show() {
      this.showFlag = true;
      setTimeout(() => {
        this.$refs.listContent.refresh();
        this.scrollToCurrent();
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    getCurrentIcon(item) { // 正在播放歌曲图标
      if (item.id === this.currentSong.id) {
        return 'icon-play';
      };
      return '';
    },
    selectItem(item, index) { // 点击播放歌曲
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex((listItem) => {
          return item.id === listItem.id;
        });
      };
      this.setCurrentIndex(index);
      this.setPlayingState(true);
    },
    scrollToCurrent() { // 滚动到正在播放的歌曲位置
      let index = this.sequenceList.findIndex((item) => {
        return item.id === this.currentSong.id;
      });
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300);
    },
    deleteOne(item) { // 从列表中删除某曲
      this.deleteSong(item);
      if (!this.playlist.length) {
        this.hide();
      };
    },
    showConfirm() { // 弹出对话框
      this.$refs.confirm.show();
    },
    confirmClear() { // 确认清空播放列表
      this.hide();
      this.clearPlaylist();
    },
    addSongShow() {
      this.$refs.addSong.show();
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'deleteSong',
      'clearPlaylist'
    ])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return;
      };
      this.scrollToCurrent();
    }
  },
  computed: {
    getModeText() {
      return this.mode === playMode.random ? '随机播放' : this.mode === playMode.sequence ? '循环播放' : '单曲循环';
    },
    ...mapGetters([
      'currentSong',
      'playlist'
    ])
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";
@import "~common/less/mixin";

.playlist{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: @color-background-d;
  &.list-fade-enter-active, &.list-fade-leave-active{
    transition: opacity 0.3s;
    .list-wrapper{
      transition: all 0.3s;
    }
  }
  &.list-fade-enter, &.list-fade-leave-to{
    opacity: 0;
    .list-wrapper{
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: @color-highlight-background;
    .list-header{
      position: relative;
      padding: 20px 30px 10px 20px;
      .title{
        display: flex;
        align-items: center;
        .icon{
          margin-right: 10px;
          font-size: 30px;
          color: @color-theme-d;
        }
        .text{
          flex: 1;
          font-size: @font-size-medium;
          color: @color-text-l;
        }
        .clear{
          .extend-click();
          .icon-clear{
            font-size: @font-size-medium;
            color: @color-text-d;
          }
        }
      }
    }
    .list-content{
      max-height: 240px;
      overflow: hidden;
      .item{
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        &.list-enter-active, &.list-leave-active{
          transition: all 0.1s;
        }
        &.list-enter, &.list-leave-to{
          height: 0;
        }
        .current{
          flex: 0 0 20px;
          width: 20px;
          font-size: @font-size-small;
          color: @color-theme-d;
        }
        .text{
          flex: 1;
          .no-wrap();
          font-size: @font-size-medium;
          color: @color-text-d;
        }
        .like{
          .extend-click();
          margin-right: 15px;
          font-size: @font-size-small;
          color: @color-theme;
          .icon-favorite{
            color: @color-sub-theme;
          }
        }
        .delete{
          .extend-click();
          font-size: @font-size-small;
          color: @color-theme;
        }
      }
    }
    .list-operate{
      width: 140px;
      margin: 20px auto 30px auto;
      .add{
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid @color-text-l;
        border-radius: 100px;
        color: @color-text-l;
        .icon-add{
          margin-right: 5px;
          font-size: @font-size-small-s;
        }
        .text{
          font-size: @font-size-small;
        }
      }
    }
    .list-close{
      text-align: center;
      line-height: 50px;
      background: @color-background;
      font-size: @font-size-medium-x;
      color: @color-text-l;
    }
  }
}
</style>
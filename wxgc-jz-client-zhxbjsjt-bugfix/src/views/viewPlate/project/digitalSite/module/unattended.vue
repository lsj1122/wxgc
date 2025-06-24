<template>
  <div class="boot">
    <div class="header">
      <div class="block">
        <template v-if="picture">
        <el-carousel trigger="click" height="150px">
          <el-carousel-item v-for="item in picture" :key="item">
            <img :src="item" alt="" />
          </el-carousel-item>
        </el-carousel>
        </template>
        <div class="imggg"></div>
      </div>
      <div class="head">
        <svg
          width="85"
          height="48"
          viewBox="0 0 85 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M65.4525 31.0204C65.1719 29.7392 64.5492 28.5451 63.6423 27.5491C62.7353 26.553 61.5736 25.7872 60.2651 25.323C58.9565 24.8587 57.5436 24.711 56.1576 24.8936C54.7715 25.0762 53.4574 25.5831 52.3373 26.3673V9.60857C52.337 9.08266 52.4798 8.56531 52.7523 8.10513C53.0248 7.64496 53.4181 7.25707 53.8952 6.97792C54.3723 6.69877 54.9175 6.53752 55.4796 6.50932C56.0417 6.48113 56.6022 6.58691 57.1086 6.81673L67.0695 11.338C67.6302 11.5925 68.1029 11.9893 68.4335 12.483C68.764 12.9767 68.9392 13.5474 68.9388 14.1298V27.9184C68.9388 28.7411 68.589 29.5301 67.9663 30.1118C67.3437 30.6936 66.4991 31.0204 65.6185 31.0204H65.4525ZM37.2299 31.0204C36.8456 29.2699 35.8262 27.6969 34.3441 26.5674C32.8619 25.4379 31.0078 24.821 29.0951 24.821C27.1824 24.821 25.3283 25.4379 23.8461 26.5674C22.364 27.6969 21.3446 29.2699 20.9603 31.0204H19.1342C18.2536 31.0204 17.409 30.6936 16.7863 30.1118C16.1637 29.5301 15.8138 28.7411 15.8138 27.9184V3.10204C15.8138 2.27933 16.1637 1.49031 16.7863 0.908566C17.409 0.32682 18.2536 1.92823e-08 19.1342 0H45.6967C46.5773 1.92823e-08 47.4218 0.32682 48.0445 0.908566C48.6672 1.49031 49.017 2.27933 49.017 3.10204V27.9184C49.017 28.7411 48.6672 29.5301 48.0445 30.1118C47.4218 30.6936 46.5773 31.0204 45.6967 31.0204H37.2299ZM29.0951 37.2245C30.416 37.2245 31.6828 36.7343 32.6168 35.8616C33.5508 34.989 34.0756 33.8055 34.0756 32.5714C34.0756 31.3374 33.5508 30.1538 32.6168 29.2812C31.6828 28.4086 30.416 27.9184 29.0951 27.9184C27.7742 27.9184 26.5074 28.4086 25.5734 29.2812C24.6393 30.1538 24.1146 31.3374 24.1146 32.5714C24.1146 33.8055 24.6393 34.989 25.5734 35.8616C26.5074 36.7343 27.7742 37.2245 29.0951 37.2245ZM57.3178 37.2245C58.6387 37.2245 59.9055 36.7343 60.8395 35.8616C61.7735 34.989 62.2982 33.8055 62.2982 32.5714C62.2982 31.3374 61.7735 30.1538 60.8395 29.2812C59.9055 28.4086 58.6387 27.9184 57.3178 27.9184C55.9968 27.9184 54.73 28.4086 53.796 29.2812C52.862 30.1538 52.3373 31.3374 52.3373 32.5714C52.3373 33.8055 52.862 34.989 53.796 35.8616C54.73 36.7343 55.9968 37.2245 57.3178 37.2245Z"
            fill="#00D3E0"
          />
          <path
            d="M0 48V46.6814L9.18083 39.3344H11.7597V48H0Z"
            fill="#00D3E0"
          />
          <path
            d="M85 48V46.6814L75.8192 39.3344H73.2403V48H85Z"
            fill="#00D3E0"
          />
          <rect
            x="11.7598"
            y="43.4788"
            width="61.4806"
            height="4.52119"
            fill="#00D3E0"
          />
          <rect
            x="12.1725"
            y="38.2041"
            width="60.6553"
            height="4.52119"
            fill="#00D3E0"
          />
        </svg>
        <div class="quality">
          总重量：
          <br />
          <span>{{ (weight * 1).toFixed(2) }}</span>
          吨
        </div>
      </div>
      <div class="head">
        <svg
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.25 50H3.125C1.25 50 0 48.75 0 46.875V3.125C0 1.25 1.25 0 3.125 0H6.25V9.375H18.75V0H31.25V9.375H43.75V0H46.875C48.75 0 50 1.25 50 3.125V46.875C50 48.75 48.75 50 46.875 50H43.75H6.25ZM6.25 43.75V15.625H43.75V43.75H6.25ZM12.5 28.125V21.875H18.75V28.125H12.5ZM15.625 0H9.375V6.25H15.625V0ZM34.375 0H40.625V6.25H34.375V0ZM28.125 21.875H21.875V28.125H28.125V21.875ZM37.5 21.875V28.125H31.25V21.875H37.5ZM18.75 37.5V31.25H12.5V37.5H18.75ZM21.875 31.25H28.125V37.5H21.875V31.25ZM37.5 37.5V31.25H31.25V37.5H37.5Z"
            fill="#00D3E0"
          />
        </svg>
        <div class="quality">
          当日重量:
          <br />
          <span>{{ (todayweight * 1).toFixed(2) }}</span>
          公斤
        </div>
      </div>
      <div class="head">
        <svg
          width="60"
          height="45"
          viewBox="0 0 60 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M56.0625 37.2881C55.7456 35.7481 55.0423 34.3127 54.018 33.1154C52.9937 31.918 51.6816 30.9976 50.2037 30.4395C48.7258 29.8815 47.1301 29.7039 45.5647 29.9234C43.9993 30.1429 42.5151 30.7523 41.25 31.6949V11.55C41.2497 10.9178 41.411 10.2959 41.7188 9.74279C42.0265 9.18964 42.4707 8.72337 43.0095 8.38782C43.5483 8.05226 44.1641 7.85843 44.799 7.82454C45.4338 7.79065 46.0669 7.91781 46.6388 8.19407L57.8888 13.6288C58.522 13.9347 59.0558 14.4117 59.4292 15.0052C59.8026 15.5987 60.0004 16.2847 60 16.9847V33.5593C60 34.5483 59.6049 35.4967 58.9017 36.196C58.1984 36.8953 57.2446 37.2881 56.25 37.2881H56.0625ZM24.1875 37.2881C23.7535 35.1839 22.6022 33.2931 20.9282 31.9354C19.2543 30.5776 17.1603 29.8361 15 29.8361C12.8397 29.8361 10.7457 30.5776 9.07176 31.9354C7.3978 33.2931 6.24653 35.1839 5.8125 37.2881H3.75C2.75544 37.2881 1.80161 36.8953 1.09835 36.196C0.395087 35.4967 2.331e-08 34.5483 0 33.5593V3.72881C2.331e-08 2.73987 0.395087 1.79143 1.09835 1.09214C1.80161 0.392855 2.75544 2.31783e-08 3.75 0H33.75C34.7446 2.31783e-08 35.6984 0.392855 36.4016 1.09214C37.1049 1.79143 37.5 2.73987 37.5 3.72881V33.5593C37.5 34.5483 37.1049 35.4967 36.4016 36.196C35.6984 36.8953 34.7446 37.2881 33.75 37.2881H24.1875ZM15 44.7458C16.4918 44.7458 17.9226 44.1565 18.9775 43.1075C20.0324 42.0586 20.625 40.636 20.625 39.1525C20.625 37.6691 20.0324 36.2465 18.9775 35.1975C17.9226 34.1486 16.4918 33.5593 15 33.5593C13.5082 33.5593 12.0774 34.1486 11.0225 35.1975C9.96763 36.2465 9.375 37.6691 9.375 39.1525C9.375 40.636 9.96763 42.0586 11.0225 43.1075C12.0774 44.1565 13.5082 44.7458 15 44.7458ZM46.875 44.7458C48.3668 44.7458 49.7976 44.1565 50.8525 43.1075C51.9074 42.0586 52.5 40.636 52.5 39.1525C52.5 37.6691 51.9074 36.2465 50.8525 35.1975C49.7976 34.1486 48.3668 33.5593 46.875 33.5593C45.3832 33.5593 43.9524 34.1486 42.8975 35.1975C41.8426 36.2465 41.25 37.6691 41.25 39.1525C41.25 40.636 41.8426 42.0586 42.8975 43.1075C43.9524 44.1565 45.3832 44.7458 46.875 44.7458Z"
            fill="#00D3E0"
          />
        </svg>

        <div class="quality">
          总车次:
          <br />
          <span>{{ number }}</span>
          次
        </div>
      </div>
      <div class="head">
        <svg
          width="52"
          height="52"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M26 0C11.641 0 0 11.641 0 26C0 40.359 11.641 52 26 52C40.359 52 52 40.359 52 26C52 11.641 40.359 0 26 0ZM43.3155 36.3356C42.8505 37.1463 41.8015 37.4264 40.9968 36.9555L24.8615 27.6451C24.6946 27.5497 24.5456 27.4246 24.4264 27.2815C23.5264 26.9179 22.8826 26.0358 22.8826 25.0046V10.6635C22.8826 9.31637 23.9853 8.21366 25.3324 8.21366C26.6795 8.21366 27.7822 9.31637 27.7822 10.6635V25.0105C27.7822 25.1417 27.7703 25.2728 27.7524 25.398L42.6896 34.0229C43.5002 34.4878 43.7804 35.5309 43.3155 36.3356Z"
            fill="#00D3E0"
          />
        </svg>
        <div class="quality">
          当日车次：
          <br />
          <span>{{ todaynumber }}</span>
          次
        </div>
      </div>
    </div>
    <div class="content">
      <div class="contentLeft">
        <div id="weight" style="height: 300px; width: 50vw;"></div>
      </div>
      <div class="contentRight">
        <div id="number" style="height: 300px; width: 50vw;"></div>
      </div>
    </div>

    <div class="footer">
      <el-tabs v-model="activeName" @tab-click="handleClick">
           <el-tab-pane label="双次过磅" name="second">
          <!-- 表格 -->
          <el-table
            :data="doubledata"
            style="width: 100%"
            height="260px"
            @row-click="clickdoubleData"
          >
            <el-table-column prop="deviceName" label="设备名称" align="center">
            </el-table-column>
            <el-table-column prop="carNumber" label="车次编码" align="center">
            </el-table-column>
            <el-table-column
              prop="licensePlate"
              label="车牌号码"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="plateColor" label="车牌颜色" align="center">
            </el-table-column>
            <el-table-column
              prop="enterTime"
              label="单次过磅时间"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="outTime" label="双次过磅时间" align="center">
            </el-table-column>
            <el-table-column prop="grossWeight" label="毛重" align="center">
            </el-table-column>
            <el-table-column prop="tareWeight" label="皮重" align="center">
            </el-table-column>
            <el-table-column prop="netWeight" label="净重" align="center">
            </el-table-column>
            <el-table-column prop="companyName" label="单位名称" align="center">
            </el-table-column>
            <el-table-column prop="goodsName" label="商品名称" align="center">
            </el-table-column>
            <el-table-column prop="goodsModel" label="规格型号" align="center">
            </el-table-column>
            <el-table-column prop="driverName" label="司机姓名" align="center">
            </el-table-column>
            <el-table-column
              prop="driverMobile"
              label="司机电话"
              align="center"
            >
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            class="el-pagination"
            v-show="total > 0"
            background
            layout="prev, pager, next"
            :current-page.sync="listQuery.pageIndex"
            :page-size.sync="listQuery.pageSize"
            @current-change="loaddoubleData"
            :total="sum"
          >
          </el-pagination>
          <el-dialog
            title="双次过磅详情"
            :visible.sync="dialogVisible"
            width="50%"
            top = 10vh
            :close-on-click-modal="false"
          >
            <el-form :model="frominfo" ref="dataForm" :rules="rules">
              <el-row>
                <el-col :span="11">
                  <el-form-item
                    label="车次编码"
                    :label-width="formLabelWidth"
                    prop="carNumber"
                  >
                    <el-input
                      v-model="frominfo.carNumber"
                      autocomplete="off"
                      style="width:250px"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="车牌颜色"
                    :label-width="formLabelWidth"
                    prop="plateColor"
                  >
                    <el-input
                      v-model="frominfo.plateColor"
                      autocomplete="off"
                      style="width:250px"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    label="皮重"
                    :label-width="formLabelWidth"
                    prop="tareWeight"
                  >
                    <el-input
                      v-model="frominfo.tareWeight"
                      autocomplete="off"
                      style="width:250px"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item
                    label="车牌号码"
                    :label-width="formLabelWidth"
                    prop="licensePlate"
                  >
                    <el-input
                      v-model="frominfo.licensePlate"
                      autocomplete="off"
                      style="width:250px"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="毛重"
                    :label-width="formLabelWidth"
                    prop="grossWeight"
                  >
                    <el-input
                      v-model="frominfo.grossWeight"
                      autocomplete="off"
                      style="width:250px"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    label="净重"
                    :label-width="formLabelWidth"
                    prop="netWeight"
                  >
                    <el-input
                      v-model="frominfo.netWeight"
                      autocomplete="off"
                      style="width:250px"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-divider content-position="center">
                单次过磅
              </el-divider>
              <el-row>
                <el-col :span="11">
                  <el-form-item
                    label="过磅时间"
                    :label-width="formLabelWidth"
                    prop="enterTime"
                  >
                    <el-input
                      v-model="frominfo.enterTime"
                      autocomplete="off"
                      style="width:250px"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="车牌图片" prop="enterPlateName">
                    <el-image
                      v-if="frominfo.enterPlateName"
                      style="height: 50px; width: 300px"
                      :src="frominfo.enterPlateName"
                      :preview-src-list="[frominfo.enterPlateName]"
                    >
                    </el-image>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="车辆图片" prop="enterLicenseName">
                    <el-image
                      v-if="frominfo.enterLicenseName"
                      style="height: 50px; width: 300px"
                      :src="frominfo.enterLicenseName"
                      :preview-src-list="[frominfo.enterLicenseName]"
                    >
                    </el-image>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-divider>
                双次过磅
              </el-divider>

              <el-row>
                <el-col :span="11">
                  <el-form-item
                    label="过磅时间"
                    :label-width="formLabelWidth"
                    prop="outTime"
                  >
                    <el-input
                      v-model="frominfo.outTime"
                      autocomplete="off"
                      style="width:250px"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="车牌图片" prop="outPlateName">
                    <el-image
                      v-if="frominfo.outPlateName"
                      style="height: 50px; width: 300px"
                      :src="frominfo.outPlateName"
                      :preview-src-list="[frominfo.enterPlateName]"
                    >
                    </el-image>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="车辆图片" prop="outLicenseName">
                    <el-image
                      v-if="frominfo.outLicenseName"
                      style="height: 50px; width: 300px"
                      :src="frominfo.outLicenseName"
                      :preview-src-list="[frominfo.enterLicenseName]"
                    >
                    </el-image>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item
                    label="单位名称"
                    :label-width="formLabelWidth"
                    prop="companyName"
                  >
                    <el-input
                      v-model="frominfo.companyName"
                      autocomplete="off"
                      style="width:250px"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    label="规格型号"
                    :label-width="formLabelWidth"
                    prop="goodsModel"
                  >
                    <el-input
                      v-model="frominfo.goodsModel"
                      autocomplete="off"
                      style="width:250px"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    label="司机姓名"
                    :label-width="formLabelWidth"
                    prop="driverName"
                  >
                    <el-input
                      v-model="frominfo.driverName"
                      autocomplete="off"
                      style="width:250px"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item
                    label="商品名称"
                    :label-width="formLabelWidth"
                    prop="goodsName"
                  >
                    <el-input
                      v-model="frominfo.goodsName"
                      autocomplete="off"
                      style="width:250px"
                    >
                    </el-input>
                  </el-form-item>

                  <el-form-item
                    label="司机电话"
                    :label-width="formLabelWidth"
                    prop="driverMobile"
                  >
                    <el-input
                      v-model="frominfo.driverMobile"
                      autocomplete="off"
                      style="width:250px"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false"
                >确 定</el-button
              >
            </div>
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="单次过磅" name="first">
          <!-- 表格 -->

          <el-table
            :data="singledata"
            style="width: 100%"
            height="260px"
            @row-click="clickData"
          >
            <el-table-column prop="deviceName" label="设备名称" align="center">
            </el-table-column>
            <el-table-column prop="carNumber" label="车次编码" align="center">
            </el-table-column>
            <el-table-column
              prop="licensePlate"
              label="车牌号码"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="plateColor" label="车牌颜色" align="center">
            </el-table-column>
            <el-table-column
              prop="enterTime"
              label="单次过磅时间"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="grossWeight" label="毛重" align="center">
            </el-table-column>
            <el-table-column prop="tareWeight" label="皮重" align="center">
            </el-table-column>
            <el-table-column prop="netWeight" label="净重" align="center">
            </el-table-column>
            <el-table-column prop="companyName" label="单位名称" align="center">
            </el-table-column>
            <el-table-column prop="goodsName" label="商品名称" align="center">
            </el-table-column>
            <el-table-column prop="goodsModel" label="规格型号" align="center">
            </el-table-column>
            <el-table-column prop="driverName" label="司机姓名" align="center">
            </el-table-column>
            <el-table-column
              prop="driverMobile"
              label="司机电话"
              align="center"
            >
            </el-table-column>
          </el-table>
          <!-- 分页 -->
             <!-- 分页 -->
   <el-pagination
      class="el-pagination"
      v-show="total > 0"
      background
      layout="prev, pager, next"
      :current-page.sync="listQuery.pageIndex"
      :page-size.sync="listQuery.pageSize"
      @current-change="loadSingData"
      :total="total"
    >
    </el-pagination>

          <el-dialog
            title="单次过磅详情"
            :visible.sync="dialogFormVisible"
            width="50%"
            :close-on-click-modal="false"
          >
            <el-form :model="forminfo" ref="dataForm" :rules="rules">
              <el-row>
                <el-col :span="11">
                  <el-form-item
                    label="车次编码"
                    :label-width="formLabelWidth"
                    prop="carNumber"
                  >
                    <el-input
                      v-model="forminfo.carNumber"
                      autocomplete="off"
                      style="width:250px"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="车牌颜色"
                    :label-width="formLabelWidth"
                    prop="plateColor"
                  >
                    <el-input
                      v-model="forminfo.plateColor"
                      autocomplete="off"
                      style="width:250px"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="车牌图片" prop="enterPlateName">
                    <el-image
                      v-if="forminfo.enterPlateName"
                      style="height: 50px; width: 300px"
                      :src="forminfo.enterPlateName"
                      :preview-src-list="[forminfo.enterPlateName]"
                    >
                    </el-image>
                  </el-form-item>
                  <el-form-item
                    label="毛重"
                    :label-width="formLabelWidth"
                    prop="grossWeight"
                  >
                    <el-input
                      v-model="forminfo.grossWeight"
                      autocomplete="off"
                      style="width:250px"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    label="净重"
                    :label-width="formLabelWidth"
                    prop="netWeight"
                  >
                    <el-input
                      v-model="forminfo.netWeight"
                      autocomplete="off"
                      style="width:250px"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    label="规格型号"
                    :label-width="formLabelWidth"
                    prop="goodsModel"
                  >
                    <el-input
                      v-model="forminfo.goodsModel"
                      autocomplete="off"
                      style="width:250px"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    label="司机姓名"
                    :label-width="formLabelWidth"
                    prop="driverName"
                  >
                    <el-input
                      v-model="forminfo.driverName"
                      autocomplete="off"
                      style="width:250px"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item
                    label="车牌号码"
                    :label-width="formLabelWidth"
                    prop="licensePlate"
                  >
                    <el-input
                      v-model="forminfo.licensePlate"
                      autocomplete="off"
                      style="width:250px"
                    ></el-input>
                  </el-form-item>

                  <el-form-item
                    label="单次过磅时间"
                    :label-width="formLabelWidth"
                    prop="enterTime"
                  >
                    <el-input
                      v-model="forminfo.enterTime"
                      autocomplete="off"
                      style="width:250px"
                    >
                    </el-input>
                  </el-form-item>

                  <el-form-item label="车辆图片" prop="enterLicenseName">
                    <el-image
                      v-if="forminfo.enterLicenseName"
                      style="height: 50px; width: 300px"
                      :src="forminfo.enterLicenseName"
                      :preview-src-list="[forminfo.enterLicenseName]"
                    >
                    </el-image>
                  </el-form-item>

                  <el-form-item
                    label="皮重"
                    :label-width="formLabelWidth"
                    prop="tareWeight"
                  >
                    <el-input
                      v-model="forminfo.tareWeight"
                      autocomplete="off"
                      style="width:250px"
                    >
                    </el-input>
                  </el-form-item>

                  <el-form-item
                    label="单位名称"
                    :label-width="formLabelWidth"
                    prop="companyName"
                  >
                    <el-input
                      v-model="forminfo.companyName"
                      autocomplete="off"
                      style="width:250px"
                    >
                    </el-input>
                  </el-form-item>

                  <el-form-item
                    label="商品名称"
                    :label-width="formLabelWidth"
                    prop="goodsName"
                  >
                    <el-input
                      v-model="forminfo.goodsName"
                      autocomplete="off"
                      style="width:250px"
                    >
                    </el-input>
                  </el-form-item>

                  <el-form-item
                    label="司机电话"
                    :label-width="formLabelWidth"
                    prop="driverMobile"
                  >
                    <el-input
                      v-model="forminfo.driverMobile"
                      autocomplete="off"
                      style="width:250px"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogFormVisible = false"
                >确 定</el-button
              >
            </div>
          </el-dialog>
        </el-tab-pane>
     
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  getAllweighbridgeManager,
  getSingleManager,
  getdoubleManager
} from "../api/weighbridge.js";

export default {
  data() {
    return {
      forminfo: {},
      frominfo: {},
      listQuery: {
        pageIndex: 1,
        pageSize: 10
      },
      total: "",
      activeName: "second",
      picture: [], //轮播图
      weight: "", //总重量
      todayweight: "", //当日重量
      number: "", //总车次
      todaynumber: "", //今日车次
      weightTrend: [], //重量趋势
      weightData: [], //重量时间
      carTrend: [], //车次趋势
      carData: [], //车次时间
      singledata: [], //单次过磅
      doubledata: [], //双次过磅
      dialogFormVisible: false,
      dialogVisible: false,
      sum:""
    };
  },
  created() {
    this.loadAllData(), this.loadSingData(), this.loaddoubleData();
  },

  mounted() {},

  methods: {
    // 折线图
    weightEchart() {
      let myChart = echarts.init(document.getElementById("weight"));
      let option = {
        title: {
          text: "近7天重量趋势",
          padding: [10, 0, 0, 50],
          textStyle: {
            color: "#fff"
          }
        },
        tooltip: {
          show: true
        },
        xAxis: {
          type: "category",
          data: this.weightData,
          boundaryGap: false,
          axisLabel: { color: "#7990A6" },
           axisLine: {
            lineStyle:{
              color:"#7792A2"
            }
          }
        },
        yAxis: {
          type: "value",
          name: "单位：公斤",
          axisLabel: { color: "#7990A6" },
          nameTextStyle: {
            //单位'个'的样式
            color: "#7990A6"
          },
          axisLine: {
            lineStyle:{
              color:"#7792A2"
            }
          }
        },
        series: [
          {
            data: this.weightTrend,
            type: "line",
            color: "#3DA1AF",
            symbol: "circle",
            symbolSize: 7,
            smooth: true
          }
        ]
      };
      option && myChart.setOption(option);
    },
    numberEchart() {
      let myChart = echarts.init(document.getElementById("number"));
      let option = {
        title: {
          text: "近7天车次趋势",
          padding: [10, 0, 0, 50],
          textStyle: {
            color: "#fff"
          }
        },
        tooltip: {
          show: true
        },
        xAxis: {
          type: "category",
          data: this.carData,
          boundaryGap: false,
          axisLabel: { color: "#7792A2" },
           axisLine: {
            lineStyle:{
              color:"#7792A2"
            }
          }
        },
        yAxis: {
          type: "value",
          name: "单位：次",
          axisLabel: { color: "#7792A2" },
          nameTextStyle: {
            //单位'个'的样式
            color: "#7792A2"
          },
          axisLine: {
            lineStyle:{
              color:"#7792A2"
            }
          }
        },
        series: [
          {
            data: this.carTrend,
            type: "line",
            color: "#D6AB3A",
            symbol: "circle",
            symbolSize: 7,
            smooth: true
          }
        ]
      };
      option && myChart.setOption(option);
    },

    loadAllData() {
      getAllweighbridgeManager()
        .then(res => {
          if (res.code == "success") {
            console.log(1111,res);
            this.picture = res.data.devicePic;
            this.weight = res.data.totalWeight;
            this.todayweight = res.data.todayWeight;
            this.number = res.data.totalCarNum;
            this.todaynumber = res.data.todayCarNum;
            // this.singledata = res.data.singleWorkData;
            // this.doubledata = res.data.doubleWorkData;

            for (let key in res.data.weightTrend) {
              this.weightTrend.push(res.data.weightTrend[key]);
              this.weightData.push(key);
            }
            this.weightEchart();
            for (let item in res.data.carNumTrend) {
              this.carTrend.push(res.data.carNumTrend[item]);
              this.carData.push(item);
   
            }
            this.numberEchart();
        
          }
          this.dataLoading = false;
        })
        .catch(err => {
          this.dataLoading = false;
        });
    },

    // 分页查询单次过磅
    loadSingData() {
      this.dataLoading = true;
      getSingleManager(this.listQuery)
        .then(res => {
          if (res.code == "success") {
            this.singledata = res.data.records;
            this.total = res.data.total;
            console.log("单次数据", res);
          }
          this.dataLoading = false;
        })
        .catch(err => {
          console.log(JSON.stringify(err));
          this.dataLoading = false;
        });
    },
    //分页双次查询
    loaddoubleData() {
      this.dataLoading = true;
      getdoubleManager(this.listQuery)
        .then(res => {
          if (res.code == "success") {
            this.doubledata = res.data.records;
            this.sum = res.data.total;
            console.log("单次数据", res);
          }
          this.dataLoading = false;
        })
        .catch(err => {
          console.log(JSON.stringify(err));
          this.dataLoading = false;
        });
    },

    // tbs切换
    handleClick(tab, event) {
      console.log(tab, event);
    },

    clickData(row) {
      this.forminfo = row;
      console.log(row);
      this.dialogFormVisible = true;
    },
    clickdoubleData(row) {
      this.frominfo = row;
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep.el-form-item .el-form-item__content{
        margin-left: 66px;
}
::v-deep.el-table thead {
  color: rgba(144, 200, 255, 1);
}
::v-deep.el-divider {
    background-color:#1375D3
}

::v-deep .el-tabs__nav-wrap::after {
  background-color:rgba(126, 183, 255, 0.1000);
}
::v-deep.el-divider__text {
    background-color:rgba(126, 183, 255, 0.1000);
    color:#1375D3;
}
::v-deep .el-tabs__item {
  font-size: 16px;
  color: #fff !important;
}
.header {
  display: flex;
  justify-content: space-between;
  .block {
    width: 300px;
    height: 150px;
    img {
      width: 100%;
      height: 100%;
    }
    .imggg{
      width: 100%;
      height: 100%;
      background:rgba(126, 183, 255, 0.1000) ;
    }
  }
  .head {
    display: flex;
    width: 350px;
    height: 150px;
    background:rgba(126, 183, 255, 0.1000);
    font-size: 20px;
    font-weight: 500;
    align-items: center;
    padding-left: 15px;
    .quality {
      margin-left: 15px;
    }
    img {
      width: 50px;
      height: 50px;
    }
    span {
      line-height: 50px;
      color: #01d5d2;
      font-weight: 700;
    }
  }
}

.content {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;

  .contentLeft {
    width: 49%;
    background:rgba(126, 183, 255, 0.1000);
  }
  .contentRight {
    width: 49%;
    background:rgba(126, 183, 255, 0.1000);
  }
}
.footer {
  margin-top: 20px;
  background: rgba(126, 183, 255, 0.1000);
}
</style>

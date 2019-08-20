<template>

  <div class="app-container calendar-list-container">
    <!-- 流程图 -->
    <div style="width: 100%; display: flex; justify-content: space-between;margin:10px">
      <div id="diagramMonitorDiv" style="flex-grow: 1; height: 500px; border: solid 1px black"></div>
    </div>
    <!-- 搜索条件 -->
    <div class="filter-container">
      业务编号:<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="业务编号"
        v-model="listQuery.aId">
      </el-input>
      业务类型:<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="模板名称"
        v-model="listQuery.procName">
      </el-input>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
    </div>
    <!-- 列表数据 -->
    <el-table :data="list" border style="width: 100%;margin:10px" :row-style="rowStyleConfig" @row-click="rowSingleClickHandle">
      <el-table-column prop="aid" label="业务编号">
      </el-table-column>
      <el-table-column prop="procName" label="业务类型">
      </el-table-column>
      <el-table-column prop="totalLimit" label="总期限(单位:秒)">
      </el-table-column>
      <el-table-column prop="crtTime" label="开始时间">
      </el-table-column>
      <el-table-column prop="endTimeStr" label="结束时间">
      </el-table-column>
      <el-table-column prop="status" label="状态">
      </el-table-column>
    </el-table>
    <!-- 分页控件 -->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>

</template>

<script>
  import {
    page,
    getImageJsonByBusinessNo
  } from '@/api/businessProcess/businessProcessMonitor/index';
  import go from 'gojs';
  let $ = go.GraphObject.make;  // 后面很多用到该变量来初始化diagram
  export default {
    data() {
      return {
        diagram: null,
        // diagram_json: `{"class":"go.GraphLinksModel","linkFromPortIdProperty":"fromPort","linkToPortIdProperty":"toPort","nodeDataArray": [ {"key":-1, "category":"Start", "loc":"174.99999999999997 5.999999999999998", "text":"开始"},{"text":"签订合同", "key":-3, "loc":"175 94"},{"text":"办证", "key":-4, "loc":"103 178"},{"text":"办证登簿", "key":-5, "loc":"176 261"},{"text":"交税", "key":-6, "loc":"245 179"},{"category":"End", "text":"结束", "key":-7, "loc":"176.00000000000003 342.8779276556559"}],"linkDataArray": [ {"from":-1, "to":-3,"color":"blue","fromPort":"B","toPort":"T", "points":[175,27.31782991941585,175,37.31782991941585,175,52.43391495970792,175,52.43391495970792,175,67.55,175,77.55]},{"from":-3, "to":-4, "color":"red","fromPort":"B", "toPort":"T", "points":[162.55555534362793,110.45,162.55555534362793,120.45,162.55555534362793,136,103,136,103,151.55,103,161.55]},{"from":-3, "to":-6, "color":"blue","fromPort":"B", "toPort":"T", "points":[187.44444465637207,110.45,187.44444465637207,120.45,187.44444465637207,136.5,245,136.5,245,152.55,245,162.55]},{"from":-4, "to":-5, "fromPort":"B", "toPort":"T", "points":[103,194.45000000000002,103,204.45000000000002,103,219.5,163.55555534362793,219.5,163.55555534362793,234.55,163.55555534362793,244.55]},{"from":-6, "to":-5, "fromPort":"B", "toPort":"T", "points":[245,195.45000000000002,245,205.45000000000002,245,220,188.44444465637207,220,188.44444465637207,234.55,188.44444465637207,244.55]},{"from":-5, "to":-7, "fromPort":"B", "toPort":"T", "points":[176,277.45000000000005,176,287.45000000000005,176,299.50504886812007,176.00000000000003,299.50504886812007,176.00000000000003,311.56009773624015,176.00000000000003,321.56009773624015]}]}`,
        diagram_json:{},
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          aId: undefined,
          procName: undefined
        }
      }
    },
    watch: {

    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
            this.listLoading = false;
          })
      },
      rowSingleClickHandle(row, event, column){
        getImageJsonByBusinessNo(row.aid).then(rsp=>{
          let rsp_data = rsp.data;
          this.diagram_json = rsp_data.imageJson;
          this.load();
        });
      },
      handleFilter() {
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      rowStyleConfig({ row, rowIndex }) {
        console.log()
        if (row.status.toString().indexOf('超时') != -1) {
          return 'background-color:rgb(255, 124, 124)';
        }
      },
      nodeStyle() {
        return [
          // The Node.location comes from the "loc" property of the node data,
          // converted by the Point.parse static method.
          // If the Node.location is changed, it updates the "loc" property of the node data,
          // converting back using the Point.stringify static method.
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          {
            // the Node.location is at the center of each node
            locationSpot: go.Spot.Center
          }
        ];
      },
      makePort(name, align, spot, output, input) {
        var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
        // the port is basically just a transparent rectangle that stretches along the side of the node,
        // and becomes colored when the mouse passes over it
        return $(go.Shape,
          {
            fill: "transparent",  // changed to a color in the mouseEnter event handler
            strokeWidth: 0,  // no stroke
            width: horizontal ? NaN : 8,  // if not stretching horizontally, just 8 wide
            height: !horizontal ? NaN : 8,  // if not stretching vertically, just 8 tall
            alignment: align,  // align the port on the main Shape
            stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
            portId: name,  // declare this object to be a "port"
            fromSpot: spot,  // declare where links may connect at this port
            fromLinkable: output,  // declare whether the user may draw links from here
            toSpot: spot,  // declare where links may connect at this port
            toLinkable: input,  // declare whether the user may draw links to here
            cursor: "pointer",  // show a different cursor to indicate potential link point
            mouseEnter: function (e, port) {  // the PORT argument will be this Shape
              if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
            },
            mouseLeave: function (e, port) {
              port.fill = "transparent";
            }
          });
      },
      textStyle() {
        return {
          font: "bold 11pt Helvetica, Arial, sans-serif",
          stroke: "whitesmoke"
        }
      },
      showLinkLabel(e) {
        var label = e.subject.findObject("LABEL");
        if (label !== null) label.visible = (e.subject.fromNode.data.category === "Conditional");
      },
      load() {
        // this.diagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
        this.diagram.model = go.Model.fromJson(this.diagram_json);
      },
      printDiagram() {
        var svgWindow = window.open();
        if (!svgWindow) return;  // failure to open a new Window
        var printSize = new go.Size(700, 960);
        var bnds = this.diagram.documentBounds;
        var x = bnds.x;
        var y = bnds.y;
        while (y < bnds.bottom) {
          while (x < bnds.right) {
            var svg = this.diagram.makeSVG({ scale: 1.0, position: new go.Point(x, y), size: printSize });
            svgWindow.document.body.appendChild(svg);
            x += printSize.width;
          }
          x = bnds.x;
          y += printSize.height;
        }
        setTimeout(function () { svgWindow.print(); }, 1);
      }
    },
    mounted() {
      let myDiagram =
        $(go.Diagram, "diagramMonitorDiv",  // must name or refer to the DIV HTML element
          {
            initialContentAlignment: go.Spot.Center,
            allowDrop: true,  // must be true to accept drops from the Palette
            "LinkDrawn": (e) => {
              var label = e.subject.findObject("LABEL");
              if (label !== null) label.visible = (e.subject.fromNode.data.category === "Conditional");
            },  // this DiagramEvent listener is defined below
            "LinkRelinked": (e) => {
              var label = e.subject.findObject("LABEL");
              if (label !== null) label.visible = (e.subject.fromNode.data.category === "Conditional");
            },
            scrollsPageOnFocus: false,
            "undoManager.isEnabled": true  // enable undo & redo
          });
      // when the document is modified, add a "*" to the title and enable the "Save" button
      myDiagram.addDiagramListener("Modified", function (e) {
        var button = document.getElementById("SaveButton");
        if (button) button.disabled = !myDiagram.isModified;
        var idx = document.title.indexOf("*");
        if (myDiagram.isModified) {
          if (idx < 0) document.title += "*";
        } else {
          if (idx >= 0) document.title = document.title.substr(0, idx);
        }
      });
      myDiagram.nodeTemplateMap.add("",  // the default category
        $(go.Node, "Table", this.nodeStyle(),
          // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
          $(go.Panel, "Auto",
            $(go.Shape, "Rectangle",
              { minSize: new go.Size(80, 35), fill: "#00A9C9", strokeWidth: 0 },
              new go.Binding("figure", "figure")),
            $(go.TextBlock, this.textStyle(),
              {
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true
              },
              new go.Binding("text").makeTwoWay())
          ),
          // four named ports, one on each side:
          this.makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
          this.makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
          this.makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
          this.makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
        ));
      myDiagram.nodeTemplateMap.add("Conditional",
        $(go.Node, "Table", this.nodeStyle(),
          // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
          $(go.Panel, "Auto",
            $(go.Shape, "Diamond",
              { fill: "#00A9C9", strokeWidth: 0 },
              new go.Binding("figure", "figure")),
            $(go.TextBlock, this.textStyle(),
              {
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true
              },
              new go.Binding("text").makeTwoWay())
          ),
          // four named ports, one on each side:
          this.makePort("T", go.Spot.Top, go.Spot.Top, false, true),
          this.makePort("L", go.Spot.Left, go.Spot.Left, true, true),
          this.makePort("R", go.Spot.Right, go.Spot.Right, true, true),
          this.makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
        ));
      myDiagram.nodeTemplateMap.add("Start",
        $(go.Node, "Table", this.nodeStyle(),
          $(go.Panel, "Auto",
            $(go.Shape, "Circle",
              { minSize: new go.Size(50, 50), fill: "#79C900", strokeWidth: 0 }),
            $(go.TextBlock, "Start", this.textStyle(), { editable: true },
              new go.Binding("text").makeTwoWay())
          ),
          // three named ports, one on each side except the top, all output only:
          this.makePort("L", go.Spot.Left, go.Spot.Left, true, false),
          this.makePort("R", go.Spot.Right, go.Spot.Right, true, false),
          this.makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
        ));
      myDiagram.nodeTemplateMap.add("End",
        $(go.Node, "Table", this.nodeStyle(),
          $(go.Panel, "Auto",
            $(go.Shape, "Circle",
              { minSize: new go.Size(50, 50), fill: "#DC3C00", strokeWidth: 0 }),
            $(go.TextBlock, "End", this.textStyle(), { editable: true },
              new go.Binding("text").makeTwoWay())
          ),
          // three named ports, one on each side except the bottom, all input only:
          this.makePort("T", go.Spot.Top, go.Spot.Top, false, true),
          this.makePort("L", go.Spot.Left, go.Spot.Left, false, true),
          this.makePort("R", go.Spot.Right, go.Spot.Right, false, true)
        ));
      myDiagram.nodeTemplateMap.add("Comment",
        $(go.Node, "Auto", this.nodeStyle(),
          $(go.Shape, "File",
            { minSize: new go.Size(80, 50), fill: "#EFFAB4", strokeWidth: 0 }),
          $(go.TextBlock, this.textStyle(),
            {
              margin: 5,
              maxSize: new go.Size(200, NaN),
              wrap: go.TextBlock.WrapFit,
              textAlign: "center",
              editable: true,
              font: "bold 12pt Helvetica, Arial, sans-serif",
              stroke: '#454545'
            },
            new go.Binding("text").makeTwoWay())
          // no ports, because no links are allowed to connect with a comment
        ));
      // replace the default Link template in the linkTemplateMap
      myDiagram.linkTemplate =
        $(go.Link,  // the whole link panel
          {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 5, toShortLength: 4,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            resegmentable: true,
            // mouse-overs subtly highlight links:
            mouseEnter: function (e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
            mouseLeave: function (e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; },
            selectionAdorned: false
          },
          new go.Binding("points").makeTwoWay(),
          $(go.Shape,  // the highlight shape, normally transparent
            { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
          $(go.Shape,  // the link path shape
            { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
            new go.Binding("stroke", "isSelected", function (sel) { return sel ? "dodgerblue" : "gray"; }).ofObject(), new go.Binding("stroke", "color")),
          $(go.Shape,  // the arrowhead
            { toArrow: "standard", strokeWidth: 0, fill: "gray" }, new go.Binding("fill", "color")),
          $(go.Panel, "Auto",  // the link label, normally not visible
            { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
            new go.Binding("visible", "visible").makeTwoWay(),
            $(go.Shape, "RoundedRectangle",  // the label shape
              { fill: "#F8F8F8", strokeWidth: 0 }),
            $(go.TextBlock, "Yes",  // the label
              {
                textAlign: "center",
                font: "10pt helvetica, arial, sans-serif",
                stroke: "#333333",
                editable: true
              },
              new go.Binding("text").makeTwoWay())
          ),
        );
      // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
      myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
      myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
      this.diagram = myDiagram;
      this.load();  // load an initial diagram from some JSON text


    }
  }

</script>

<style scoped>
  .warning-row {
    background-color: red;
  }

  .success-row {
    background-color: greenyellow;
  }
</style>
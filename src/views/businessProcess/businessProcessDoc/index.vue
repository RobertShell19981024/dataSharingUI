<template>
  <div>
    <el-row :gutter="2" style="margin-left:10px;margin-top:10px">
      <el-col :span="4">
        <span style="font-size: 14px;color: #606266;box-sizing: border-box;">模板列表:</span>
        <el-select v-model="process_value" placeholder="请选择" clearable>
          <el-option v-for="item in process_template" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-button type="info" @click="printDiagram" round>打印流程模板</el-button>
      </el-col>
    </el-row>

    <el-row :gutter="2" style="margin-left:10px;margin-top:10px;margin-right:10px">
      <el-col :span="12">
        <div style="width: 100%; display: flex; justify-content: space-between">
          <div id="diagramDocDiv" style="flex-grow: 1; height: 550px; border: solid 1px black"></div>
        </div>
      </el-col>
      <el-col :span="10" :offset="1">
        <el-table :data="tableBaseInfo" :show-header="false" border style="width: 100%">
          <el-table-column prop="input_name" width="width:50%">
          </el-table-column>
          <el-table-column prop="input_text" width="width:50%">
          </el-table-column>
        </el-table>
        <el-table :data="tableData" stripe border style="width: 100%;margin-top:10px">
          <el-table-column prop="name" label="步骤名称" width="180">
          </el-table-column>
          <el-table-column prop="note" label="步骤说明" width="180">
          </el-table-column>
          <el-table-column prop="depart" label="主管部门">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import go from 'gojs';
  let $ = go.GraphObject.make;  // 后面很多用到该变量来初始化diagram
  export default {
    data() {
      return {
        diagram: null,
        diagram_json: [`{"class":"go.GraphLinksModel","linkFromPortIdProperty":"fromPort","linkToPortIdProperty":"toPort","nodeDataArray": [ {"key":-1, "category":"Start", "loc":"174.99999999999997 5.999999999999998", "text":"开始"},{"text":"签订合同", "key":-3, "loc":"175 94"},{"text":"办证", "key":-4, "loc":"103 178"},{"text":"办证登簿", "key":-5, "loc":"176 261"},{"text":"交税", "key":-6, "loc":"245 179"},{"category":"End", "text":"结束", "key":-7, "loc":"176.00000000000003 342.8779276556559"}],"linkDataArray": [ {"from":-1, "to":-3,"fromPort":"B","toPort":"T", "points":[175,27.31782991941585,175,37.31782991941585,175,52.43391495970792,175,52.43391495970792,175,67.55,175,77.55]},{"from":-3, "to":-4, "fromPort":"B", "toPort":"T", "points":[162.55555534362793,110.45,162.55555534362793,120.45,162.55555534362793,136,103,136,103,151.55,103,161.55]},{"from":-3, "to":-6, "fromPort":"B", "toPort":"T", "points":[187.44444465637207,110.45,187.44444465637207,120.45,187.44444465637207,136.5,245,136.5,245,152.55,245,162.55]},{"from":-4, "to":-5, "fromPort":"B", "toPort":"T", "points":[103,194.45000000000002,103,204.45000000000002,103,219.5,163.55555534362793,219.5,163.55555534362793,234.55,163.55555534362793,244.55]},{"from":-6, "to":-5, "fromPort":"B", "toPort":"T", "points":[245,195.45000000000002,245,205.45000000000002,245,220,188.44444465637207,220,188.44444465637207,234.55,188.44444465637207,244.55]},{"from":-5, "to":-7, "fromPort":"B", "toPort":"T", "points":[176,277.45000000000005,176,287.45000000000005,176,299.50504886812007,176.00000000000003,299.50504886812007,176.00000000000003,311.56009773624015,176.00000000000003,321.56009773624015]}]}`, `{ "class": "go.GraphLinksModel",  "nodeDataArray": [ {"category":"Start", "text":"开始", "key":-1, "loc":"-112 -197"},{"text":"步骤1", "key":-2, "loc":"-112 -130"},{"text":"步骤2", "key":-3, "loc":"-112 -67"},{"text":"步骤3", "key":-4, "loc":"-112 -5"},{"category":"End", "text":"结束", "key":-5, "loc":"-112 60"} ],  "linkDataArray": [ {"from":-1, "to":-2, "points":[-112,-175.68217008058414,-112,-165.68217008058414,-112,-161.06608504029208,-112,-161.06608504029208,-112,-156.45,-112,-146.45]},{"from":-2, "to":-3, "points":[-112,-113.54999999999998,-112,-103.54999999999998,-112,-98.5,-112,-98.5,-112,-93.45,-112,-83.45]},{"from":-3, "to":-4, "points":[-112,-50.55,-112,-40.55,-112,-36,-112,-36,-112,-31.450000000000003,-112,-21.450000000000003]},{"from":-4, "to":-5, "points":[-112,11.450000000000003,-112,21.450000000000003,-112,25.066085040292073,-112,25.066085040292073,-112,28.682170080584143,-112,38.68217008058414]} ]}`, `{ "class": "go.GraphLinksModel",  "nodeDataArray": [ {"category":"Start", "text":"开始", "key":-1, "loc":"-116 -182"},{"text":"收件", "key":-2, "loc":"-116 -114"},{"text":"审核", "key":-3, "loc":"-116 -54"},{"text":"登簿", "key":-4, "loc":"-116 8"},{"text":"缮证", "key":-5, "loc":"-116 73"},{"category":"End", "text":"结束", "key":-6, "loc":"-116 142"} ],  "linkDataArray": [ {"from":-1, "to":-2, "points":[-116,-160.68217008058414,-116,-150.68217008058414,-116,-145.56608504029208,-116,-145.56608504029208,-116,-140.45,-116,-130.45]},{"from":-2, "to":-3, "points":[-116,-97.54999999999998,-116,-87.54999999999998,-116,-84,-116,-84,-116,-80.45,-116,-70.45]},{"from":-3, "to":-4, "points":[-116,-37.55,-116,-27.549999999999997,-116,-23,-116,-23,-116,-18.450000000000003,-116,-8.450000000000003]},{"from":-4, "to":-5, "points":[-116,24.450000000000003,-116,34.45,-116,40.5,-116,40.5,-116,46.55,-116,56.55]},{"from":-5, "to":-6, "points":[-116,89.45,-116,99.45,-116,105.06608504029208,-116,105.06608504029208,-116,110.68217008058414,-116,120.68217008058414]} ]}`],
        process_template: [
          {
            value: 0,
            label: '二手房转移登记'
          }, {
            value: 1,
            label: '一手房转移登记'
          }, {
            value: 2,
            label: '预告及预告抵押'
          }
        ],
        process_value: '',
        diagram_content: ``,
        tableData: [{
          name: '签订合同',
          note: '此步骤为签订合同',
          depart: '登记部门'
        }, {
          name: '办证',
          note: '此步骤为办证',
          depart: '税务部门'
        }, {
          name: '交税',
          note: '此步骤为交税',
          depart: '税务部门'
        }, {
          name: '办证登簿',
          note: '此步骤为办证登簿',
          depart: '登记部门'
        }],
        tableBaseInfo:[ // 流程基础信息
          {
            input_name:'业务名称',
            input_text:'二手房转移登记'
          },
          {
            input_name:'业务流程说明',
            input_text:'二手房转移登记业务主要是二手房转移登记业务主要是二手房转移登记业务主要是二手房转移登记业务主要是二手房转移登记业务主要是二手房转移登记业务主要是二手房转移登记业务主要是二手房转移登记业务主要是'
          },
          {
            input_name:'流程开始条件',
            input_text:'从登记部门的签订合同开始'
          },
          {
            input_name:'流程结束条件',
            input_text:'登记部门办证和登簿步骤完成'
          }
        ]
      }
    },
    watch: {
      process_value: function (val) {
        this.diagram_content = this.diagram_json[val];
        this.load();
      }
    },
    methods: {
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
        if (this.diagram_content == '' || this.diagram_content == undefined) {
          return;
        } else {
          // console.log(this.diagram_content);
          this.diagram.model = go.Model.fromJson(this.diagram_content);
        }
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
        $(go.Diagram, "diagramDocDiv",  // must name or refer to the DIV HTML element
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
              { minSize: new go.Size(40, 40), fill: "#79C900", strokeWidth: 0 }),
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
              { minSize: new go.Size(40, 40), fill: "#DC3C00", strokeWidth: 0 }),
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
            { fill: "#EFFAB4", strokeWidth: 0 }),
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
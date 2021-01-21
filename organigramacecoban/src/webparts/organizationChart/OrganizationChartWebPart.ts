import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import {
  SPHttpClient,
  SPHttpClientResponse   
} from '@microsoft/sp-http';

export interface ISPLists {
  value: ISPList[];
}

export interface ISPList {
  Jefe: string;
  Imagen: string;
  Puesto :string;
  Title: string;
}

export interface ISPList2 {
  title: string;
  Imagen: string;
  Puesto :string;
  name: string;
}

import {
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';
import MockHttpClient from './MockHttpClient';

import * as strings from 'OrganizationChartWebPartStrings';
import * as $ from 'jquery';
import 'orgchart';
import './orgchart.css';

import './OrganizationChartWebPart.module.scss';

export interface IOrganizationChartWebPartProps {
  description: string;
}

export default class OrganizationChartWebPart extends BaseClientSideWebPart<IOrganizationChartWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div class="OrganizationalChart" style="font-family: sans-serif;">
      </div>`;

    this._renderChartAsync();
  }

  private _getListData(): Promise<ISPLists>{
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + "/_api/web/lists/GetByTitle('OrgChar')/Items",SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }

  private _stringFormat(input: string): string {
    var lowerInput = input.replace(/\s\s+/g, ' ').toLowerCase();
    var capitalizedInput = lowerInput.charAt(0).toUpperCase() + lowerInput.slice(1);
    return capitalizedInput;
  }

  private _imgFormat(input: string): string {
    var imageUrl = input.substring(input.indexOf(">") + 1, input.lastIndexOf("<"));
    return imageUrl;
  }

  private _listToTree(list2: ISPList[]) {
    console.log(list2);
    var list = [];
    var map = {}, node, roots = [], i;

    for (i = 0; i < list2.length; i++){
      list.push({name: this._stringFormat(list2[i].Title)
        , title: this._stringFormat(list2[i].Puesto)
        , Jefe: this._stringFormat(list2[i].Jefe)
        , office: this._imgFormat(list2[i].Imagen)
      , collapsed: true});
    }

    console.log(list);
    
    for (i = 0; i < list.length; i++) {
      map[list[i].name] = i;
      list[i].children = [];
    }

    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      //console.log(node);
      if (node.Jefe !== "0" && node.Jefe !== "" && node.Jefe !== "cecoban" && node.Jefe !== "Cecoban") {
        
        list[map[node.Jefe]].children.push(node);
      } else {
        node.collapsed = false;
        roots.push(node);
      }
    }

    console.log(roots);
    return roots;
  }

  private _generateTree(list: ISPList[]): object {

    var firstObj = this._listToTree(list);

    return firstObj[0];
  }

  private _renderChartAsync(): void {
    if (Environment.type == EnvironmentType.SharePoint || 
          Environment.type == EnvironmentType.ClassicSharePoint) {
      this._getListData()
        .then((response) => {
          console.log(response);
          $(".OrganizationalChart").orgchart({
            'data': this._generateTree(response.value),
            'nodeContent': 'title',
            'pan': true,
            'zoom': true,
            'nodeTemplate': this.nodeTemplate
            });
        });
    }else{
      MockHttpClient.get(this.context.pageContext.web.absoluteUrl + "/_api/web/lists/GetByTitle('OrgChar')/Items",SPHttpClient.configurations.v1)
      .then((response: ISPList[]) => {
        $(".OrganizationalChart").orgchart({
          'data': this._generateTree(response),
          'nodeContent': 'title',
          'pan': true,
          'zoom': true,
          'nodeTemplate': this.nodeTemplate
          /*'createNode': function($node, data) {
            var secondMenuIcon = $('<i>', {
              'class': 'oci oci-info-circle second-menu-icon',
              click: function() {
                $(this).siblings('.second-menu').toggle();
              }
            });
            var secondMenu = '<div class="second-menu"><img class="avatar" src="img/avatar/' + data.id + '.jpg"></div>';
            $node.append(secondMenuIcon).append(secondMenu);
          }*/
          //'exportButton': true,
          //'exportFilename': 'CecobanOrgChart',
          //'visibleLevel': 2
          });
      });
    }
  }

  private nodeTemplate(data) {
    return `
      <span class="office"><img src="${data.office}" alt="" height="50px"/></span>
      <div class="title">${data.name}</div>
      <div class="content">${data.title}</div>
    `;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

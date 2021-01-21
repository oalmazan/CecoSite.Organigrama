import { ISPList } from './OrganizationChartWebPart';

export default class MockHttpClient {

    private static _items: ISPList[] = [{ Jefe: '', Imagen: '<div class="ExternalClass1F046516B8D140B3BBCF9A01B7E976EA">https://www.getac.com/wp-content/uploads/2020/07/x500-server_2-1.png</div>', Puesto: 'President', Title: 'Mike' },
    { Jefe: 'Mike', Imagen: '<div class="ExternalClass1F046516B8D140B3BBCF9A01B7E976EA">https://www.getac.com/wp-content/uploads/2020/07/x500-server_2-1.png</div>', Puesto: 'Vice President', Title: 'Jim' },
    { Jefe: 'Mike', Imagen: '<div class="ExternalClass1F046516B8D140B3BBCF9A01B7E976EA">https://www.getac.com/wp-content/uploads/2020/07/x500-server_2-1.png</div>', Puesto: 'Vice President 2', Title: 'Alice' },
    { Jefe: 'Jim', Imagen: '<div class="ExternalClass1F046516B8D140B3BBCF9A01B7E976EA">https://www.getac.com/wp-content/uploads/2020/07/x500-server_2-1.png</div>', Puesto: 'Leader', Title: 'Bob' },];

    public static get(restUrl: string, options?: any): Promise<ISPList[]> {
    return new Promise<ISPList[]>((resolve) => {
            resolve(MockHttpClient._items);
        });
    }
}
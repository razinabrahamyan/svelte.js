import env from '@root/env';
import widgets from '../components/widgets';
import Posts from './Posts';
import type { Schema } from './types';

let schema: Schema = {
	// Collection Name & Icon (optional) shown on Sidebar
	// See for possible Icons https://icon-sets.iconify.design/

	name: 'Image Array',
	icon: 'bi:images',
	status: 'published',

	// Defined Fields that are used in Collection
	// Inspect Widget fields for possible options
	fields: [
		widgets.ImageArray({
			db_fieldName: 'ImageArray',
			imageUploadTitle: 'Multi Image Array',
			fields: [
				widgets.ImageUpload({ db_fieldName:'Multi Image Array', path: 'media/image_array' }),
				widgets.Text({ db_fieldName: 'Name', icon: 'ri:t-box-line', localization: true }),
				widgets.Text({ db_fieldName: 'Alt-Text', icon: 'ic:outline-loyalty', localization: true }),
				widgets.Text({ db_fieldName: 'Alt-Title', icon: 'ri:t-box-line', localization: true }),

				widgets.Relation({
					db_fieldName: 'Relation to Posts',
					icon: 'mdi:relation-many-to-one',
					relation: Posts,
					display: async (data: any, field: any, entry: any) => {
						return data.name[env.LANGUAGE];
					}
				})
			]
		})
	]
};

export default schema;
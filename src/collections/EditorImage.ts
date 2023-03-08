import widgets from '../components/widgets';
import type { Schema } from './types';

const schema: Schema = {
	// Collection Name & Icon (optional) shown on Sidebar
	// See for possible Icons https://icon-sets.iconify.design/

	name: 'Image Editor',
	icon: 'bi:images',
	status: 'published',

	// Defined Fields that are used in Collection
	// Inspect Widget fields for possible options
	
	fields: [
		widgets.ImageEditorPage({
			db_fieldName: 'Image',
			fields: [
				widgets.ImageEditor({ db_fieldName: 'Multi Image Array', path: 'media/image_array' })
			]
		})
	]
};

export default schema;

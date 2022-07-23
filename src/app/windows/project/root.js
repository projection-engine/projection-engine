import Project from './Project.svelte';

export default  new Project({
	target: document.body,
	props: {
		name: 'world'
	}
});

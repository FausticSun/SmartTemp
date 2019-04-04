import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import AppPresenter from '../imports/ui/AppPresenter.jsx';

Meteor.startup(() => {
  render(<AppPresenter />, document.getElementById('react-target'));
});

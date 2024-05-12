import React from 'react';

const TagIcon = (props) => {
  return <span>{props.children}</span>;
};

const TagText = (props) => <p className={props.className}>{props.children}</p>;

const Tag = (props) => {
  return <span className="group inline-flex items-center space-x-1">{props.children}</span>;
};

Tag.Icon = TagIcon;

Tag.Text = TagText;

export default Tag;

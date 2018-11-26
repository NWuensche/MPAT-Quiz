/**
 *
 * Copyright (c) 2017 MPAT Consortium , All rights reserved.
 * Fraunhofer FOKUS, Fincons Group, Telecom ParisTech, IRT, Lancaster University, Leadin, RBB, Mediaset
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library. If not, see <http://www.gnu.org/licenses/>.
 *
 * AUTHORS:
 * Miggi Zwicklbauer (miggi.zwicklbauer@fokus.fraunhofer.de)
 * Thomas Tröllmich  (thomas.troellmich@fokus.fraunhofer.de)
 * Benedikt Vogel    (vogel@irt.de)
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 *
 **/
import React, { PropTypes as Types } from 'react';
import { componentLoader } from '../../../ComponentLoader';

function TextContent({ text = 'Score: x/x' }) {
  return (
    <div className="page-element-content text-content" style={{ overflow: 'hidden', fontSize: '30px', textAlign: 'center', padding: '70px 0' }}>
      <div dangerouslySetInnerHTML={{ __html: text }} className="not-scrolling" />
    </div>
  );
}

TextContent.propTypes = {
  text: Types.string
};

componentLoader.registerComponent('quizScore', { view: TextContent }, {
  isStylable: true
});

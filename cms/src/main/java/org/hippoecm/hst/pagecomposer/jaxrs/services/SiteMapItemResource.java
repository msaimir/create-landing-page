/*
 * Copyright 2015 Hippo B.V. (http://www.onehippo.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.hippoecm.hst.pagecomposer.jaxrs.services;

import java.util.concurrent.Callable;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.hippoecm.hst.configuration.HstNodeTypes;
import org.hippoecm.hst.configuration.hosting.Mount;
import org.hippoecm.hst.configuration.site.HstSite;
import org.hippoecm.hst.configuration.sitemap.HstSiteMap;
import org.hippoecm.hst.pagecomposer.jaxrs.model.SiteMapPagesRepresentation;
import org.hippoecm.hst.pagecomposer.jaxrs.model.treepicker.AbstractTreePickerRepresentation;
import org.hippoecm.hst.pagecomposer.jaxrs.model.treepicker.SiteMapTreePickerRepresentation;
import org.hippoecm.hst.pagecomposer.jaxrs.services.helpers.SiteMapHelper;

@Path("/" + HstNodeTypes.NODETYPE_HST_SITEMAPITEM + "/")
@Produces(MediaType.APPLICATION_JSON)

public class SiteMapItemResource extends AbstractConfigResource {
    private SiteMapHelper siteMapHelper;

    public void setSiteMapHelper(final SiteMapHelper siteMapHelper) {
        this.siteMapHelper = siteMapHelper;
    }

    @GET
    @Path("/picker")
    public Response getSiteMapItemTreePicker() {
        return tryGet(new Callable<Response>() {
            @Override
            public Response call() throws Exception {
                AbstractTreePickerRepresentation representation = SiteMapTreePickerRepresentation
                        .representRequestSiteMapItem(getPageComposerContextService(), siteMapHelper);
                return ok("Sitemap item loaded successfully", representation);
            }
        });
    }


    @GET
    @Path("/sitemap")
    public Response getSiteMap() {
        return tryGet(() -> {
            final HstSite site = getPageComposerContextService().getEditingPreviewSite();
            final HstSiteMap siteMap = site.getSiteMap();
            final Mount mount = getPageComposerContextService().getEditingMount();
            final SiteMapPagesRepresentation pages = new SiteMapPagesRepresentation().represent(siteMap,
                    mount, getPreviewConfigurationPath());
            return ok("Sitemap loaded successfully", pages);
        });
    }

}